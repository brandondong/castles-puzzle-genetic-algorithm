#[cfg(test)]
mod tests;

use crate::Scoring;
use rand::random;

pub(crate) struct GeneticAlgorithm {
    current_generation: Option<Vec<IndividualResult>>,
    pub num_individuals: u32,
    pub castle_points: Vec<u32>,
    num_soldiers: u32,
    pub scoring: Scoring,
}

impl GeneticAlgorithm {
    pub fn new(
        num_individuals: u32,
        castle_points: Vec<u32>,
        num_soldiers: u32,
        scoring: Scoring,
    ) -> GeneticAlgorithm {
        GeneticAlgorithm {
            current_generation: None,
            num_individuals,
            castle_points,
            num_soldiers,
            scoring,
        }
    }

    pub fn run_generation(&mut self) -> &[IndividualResult] {
        // Create the next generation.
        let generation = match &self.current_generation {
            None => {
                // First generation.
                (0..self.num_individuals)
                    .map(|_| uniform_random_individual(self.castle_points.len(), self.num_soldiers))
                    .collect()
            }
            Some(previous_generation) => {
                // Use the scores of the previous to create the new generation.
                self.generation_from_previous(previous_generation)
            }
        };

        // Evaluate scores for each individual.
        let generation_results = evaluate(generation, &self.castle_points, self.scoring);
        // Remember results for the next round.
        self.current_generation = None;
        self.current_generation.get_or_insert(generation_results)
    }

    fn generation_from_previous(
        &self,
        previous_generation: &[IndividualResult],
    ) -> Vec<Individual> {
        let cumulative_sum: Vec<(u32, &Individual)> = previous_generation
            .iter()
            .filter(|i| i.score != 0)
            .scan(0, |acc, i| {
                *acc += i.score;
                Some((*acc, &i.details))
            })
            .collect();
        // Sort castle indices by points.
        let mut sorted_castles: Vec<_> = self.castle_points.iter().enumerate().collect();
        sorted_castles.sort_by(|a, b| a.1.cmp(b.1));
        let sorted_castles: Vec<usize> = sorted_castles.iter().map(|a| a.0).collect();
        (0..self.num_individuals)
            .map(|_| {
                // Roulette wheel selection for both parents.
                let p1 = roulette_select(previous_generation, &cumulative_sum);
                let p2 = roulette_select(previous_generation, &cumulative_sum);
                // Crossover.
                let mut child = crossover(p1, p2);
                // Mutation.
                mutate(&mut child, &sorted_castles);
                child
            })
            .collect()
    }
}

fn uniform_random_individual(num_castles: usize, num_soldiers: u32) -> Individual {
    let mut soldier_distribution = Vec::with_capacity(num_castles);
    // Pick a partitioning of soldiers with uniform probability (i.e. [1, 1, 1] is equally likely as [3, 0, 0]).
    // See https://en.wikipedia.org/wiki/Stars_and_bars_%28combinatorics%29.
    // We have to choose bar indices from stars + bars total.
    let choose = num_castles as u32 - 1; // Bars (castle dividers).
    let total = num_soldiers + choose; // Stars (soldiers) + bars.
    let mut prev_index = -1;
    // Knuth's algorithm:
    let mut chosen = 0;
    for i in 0..total {
        if chosen >= choose {
            break;
        }
        let remaining = total - i;
        let needed = choose - chosen;
        if random::<f64>() < needed as f64 / remaining as f64 {
            let current_index = i as i32;
            let num_soldiers = (current_index - prev_index - 1) as u32;
            soldier_distribution.push(num_soldiers);
            prev_index = current_index;
            chosen += 1;
        }
    }
    let current_index = total as i32;
    let num_soldiers = (current_index - prev_index - 1) as u32;
    soldier_distribution.push(num_soldiers);
    Individual {
        soldier_distribution,
    }
}

fn roulette_select<'a>(
    previous_generation: &'a [IndividualResult],
    cumulative_sum: &'a [(u32, &Individual)],
) -> &'a Individual {
    // e.g. [3, 5] -> 5.
    let total_sum = match cumulative_sum.last() {
        None => {
            // All individuals are pefectly tied with 0 fitness.
            let index = (random::<f64>() * previous_generation.len() as f64) as usize;
            return &previous_generation[index].details;
        }
        Some(total) => total.0,
    };
    let p = (random::<f64>() * total_sum as f64) as u32 + 1; // Random number from 1 to 5.
    let r = cumulative_sum.binary_search_by(|s| s.0.cmp(&p));
    match r {
        Ok(index) => {
            // e.g. Search with 3, receive index 0.
            &cumulative_sum[index].1
        }
        Err(index) => {
            // e.g. Search with 2, receive index 0.
            &cumulative_sum[index].1
        }
    }
}

fn crossover(p1: &Individual, p2: &Individual) -> Individual {
    let mut rounded_down = Vec::new();
    let mut soldier_distribution = Vec::with_capacity(p1.soldier_distribution.len());
    // Average the soldiers sent for each castle.
    for (i, total) in p1
        .soldier_distribution
        .iter()
        .zip(&p2.soldier_distribution)
        .map(|(s1, s2)| s1 + s2)
        .enumerate()
    {
        soldier_distribution.push(total / 2);
        if total % 2 != 0 {
            rounded_down.push(i);
        }
    }
    let total = rounded_down.len();
    // There must be an even number of indices rounded down.
    let choose = total / 2;
    // Knuth's algorithm:
    let mut chosen = 0;
    for (i, castle_index) in rounded_down.into_iter().enumerate() {
        if chosen >= choose {
            break;
        }
        let remaining = total - i;
        let needed = choose - chosen;
        if random::<f64>() < needed as f64 / remaining as f64 {
            soldier_distribution[castle_index] += 1;
            chosen += 1;
        }
    }
    Individual {
        soldier_distribution,
    }
}

fn mutate(individual: &mut Individual, sorted_castles: &[usize]) {
    // Choose a random pair of neighboring castles to swap soldiers between.
    let left_index = (random::<f64>() * (sorted_castles.len() - 1) as f64) as usize;
    let c1 = sorted_castles[left_index];
    let c2 = sorted_castles[left_index + 1];
    // Regenerate a uniformly random distribution for those two castles.
    let total = individual.soldier_distribution[c1] + individual.soldier_distribution[c2];
    let left = (random::<f64>() * (total + 1) as f64) as u32;
    let right = total - left;
    individual.soldier_distribution[c1] = left;
    individual.soldier_distribution[c2] = right;
}

fn evaluate(
    individuals: Vec<Individual>,
    castle_points: &[u32],
    scoring: Scoring,
) -> Vec<IndividualResult> {
    let mut scores = vec![0; individuals.len()];
    // Evaluate every pair.
    for i in 0..individuals.len() {
        for j in i + 1..individuals.len() {
            let i1 = &individuals[i];
            let i2 = &individuals[j];
            let (s1, s2) = i1.battle(i2, castle_points);
            match scoring {
                Scoring::Wins => {
                    if s1 > s2 {
                        scores[i] += 1;
                    } else if s1 < s2 {
                        scores[j] += 1;
                    }
                }
                Scoring::Points => {
                    scores[i] += s1;
                    scores[j] += s2;
                }
            }
        }
    }
    let mut results: Vec<IndividualResult> = individuals
        .into_iter()
        .zip(scores)
        .map(|(individual, score)| IndividualResult {
            details: individual,
            score,
        })
        .collect();
    // Sort better scoring individuals first.
    results.sort_by(|a, b| b.score.cmp(&a.score));
    results
}

#[derive(Debug, PartialEq)]
pub(crate) struct IndividualResult {
    pub details: Individual,
    pub score: u32,
}

#[derive(Debug, PartialEq)]
pub(crate) struct Individual {
    pub soldier_distribution: Vec<u32>,
}

impl Individual {
    fn battle(&self, other: &Individual, castle_points: &[u32]) -> (u32, u32) {
        let mut score = 0;
        let mut o_score = 0;
        for ((soldiers, o_soldiers), points) in self
            .soldier_distribution
            .iter()
            .zip(&other.soldier_distribution)
            .zip(castle_points)
        {
            if soldiers > o_soldiers {
                score += points;
            } else if soldiers < o_soldiers {
                o_score += points;
            }
        }
        (score, o_score)
    }
}
