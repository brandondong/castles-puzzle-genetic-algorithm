#[cfg(test)]
mod tests;

use crate::Scoring;

pub(crate) struct GeneticAlgorithm<R: RandomProvider> {
    current_generation: Option<Vec<IndividualResult>>,
    num_individuals: u32,
    castle_points: Vec<u32>,
    num_soldiers: u32,
    scoring: Scoring,
    random: R,
}

impl<R: RandomProvider> GeneticAlgorithm<R> {
    pub fn new(
        num_individuals: u32,
        castle_points: Vec<u32>,
        num_soldiers: u32,
        scoring: Scoring,
        random: R,
    ) -> GeneticAlgorithm<R> {
        GeneticAlgorithm {
            current_generation: None,
            num_individuals,
            castle_points,
            num_soldiers,
            scoring,
            random,
        }
    }

    pub fn run_generation(&mut self) -> &[IndividualResult] {
        // Create the next generation.
        let generation = match &self.current_generation {
            None => {
                // First generation.
                (0..self.num_individuals)
                    .map(|_| {
                        uniform_random_individual(
                            self.castle_points.len(),
                            self.num_soldiers,
                            &self.random,
                        )
                    })
                    .collect()
            }
            Some(previous_generation) => {
                // Use the scores of the previous to create the new generation.
                self.generation_from_previous(previous_generation)
            }
        };

        // Evaluate scores for each individual.
        let generation_results = evaluate(generation, &self.castle_points, &self.scoring);
        // Remember results for the next round.
        self.current_generation = Some(generation_results);

        self.current_generation.as_ref().unwrap()
    }

    fn generation_from_previous(
        &self,
        previous_generation: &[IndividualResult],
    ) -> Vec<Individual> {
        let cumulative_sum: Vec<u32> = previous_generation
            .iter()
            .scan(0, |acc, i| {
                *acc += i.score;
                Some(*acc)
            })
            .collect();
        (0..self.num_individuals)
            .map(|_| {
                // Roulette wheel selection for both parents.
                let p1 = roulette_select(previous_generation, &cumulative_sum, &self.random);
                let p2 = roulette_select(previous_generation, &cumulative_sum, &self.random);
                // Crossover.
                let mut child = self.cross_over(p1, p2);
                // Mutation.
                self.mutate(&mut child);
                child
            })
            .collect()
    }
    fn cross_over(&self, p1: &Individual, p2: &Individual) -> Individual {
        todo!();
    }
    fn mutate(&self, individual: &mut Individual) {
        todo!();
    }
}

fn uniform_random_individual(
    num_castles: usize,
    num_soldiers: u32,
    random: &impl RandomProvider,
) -> Individual {
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
        if random.random() < needed as f64 / remaining as f64 {
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
    cumulative_sum: &[u32],
    random: &impl RandomProvider,
) -> &'a Individual {
    let total_sum = *cumulative_sum.last().unwrap(); // e.g. [3, 5] -> 5.
    let p = (random.random() * total_sum as f64) as u32 + 1; // Random number from 1 to 5.
    let r = cumulative_sum.binary_search(&p);
    match r {
        Ok(index) => {
            // e.g. Search with 3, receive index 0.
            &previous_generation[index].details
        }
        Err(index) => {
            // e.g. Search with 2, receive index 0.
            &previous_generation[index].details
        }
    }
}

fn evaluate(
    individuals: Vec<Individual>,
    castle_points: &[u32],
    scoring: &Scoring,
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
        .enumerate()
        .map(|(i, individual)| IndividualResult {
            details: individual,
            score: scores[i],
        })
        .collect();
    // Sort better scoring individuals first.
    results.sort_by(|a, b| b.score.cmp(&a.score));
    results
}

pub(crate) trait RandomProvider {
    fn random(&self) -> f64;
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
        for i in 0..castle_points.len() {
            let soldiers = self.soldier_distribution[i];
            let o_soldiers = other.soldier_distribution[i];
            let points = castle_points[i];
            if soldiers > o_soldiers {
                score += points;
            } else if soldiers < o_soldiers {
                o_score += points;
            }
        }
        (score, o_score)
    }
}
