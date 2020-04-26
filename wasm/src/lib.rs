#[cfg(test)]
mod tests;
mod utils;

use js_sys::Math;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct GeneticAlgorithm {
    current_generation: Option<Vec<IndividualResult>>,
    num_individuals: u32,
    castle_points: Vec<u32>,
    num_soldiers: u32,
    scoring: Scoring,
}

#[wasm_bindgen]
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

    /// Runs the next generation, returning details about the individuals and their scores achieved.
    ///
    /// Results are flattened in order to be passed back out of wasm.
    /// The format is [individual 1 castle 1 soldiers, i1c2, ..., i1 score, i2c1, ...].
    pub fn run_generation(&mut self) -> Vec<u32> {
        // Create the next generation.
        let generation = match &self.current_generation {
            None => {
                // First generation.
                self.first_generation()
            }
            Some(previous_generation) => {
                // Use the scores of the previous to create the new generation.
                self.generation_from_previous(previous_generation)
            }
        };

        // Evaluate scores for each individual.
        let generation_results = self.evaluate(generation);
        let wasm_results = GeneticAlgorithm::flatten_for_wasm(&generation_results);
        // Remember results for the next round.
        self.current_generation = Some(generation_results);

        wasm_results
    }

    fn first_generation(&self) -> Vec<Individual> {
        (0..self.num_individuals)
            .map(|_| {
                let mut soldier_distribution = Vec::with_capacity(self.castle_points.len());
                // Pick a partitioning of soldiers with uniform probability (i.e. [1, 1, 1] is equally likely as [3, 0, 0]).
                // See https://en.wikipedia.org/wiki/Stars_and_bars_%28combinatorics%29.
                // We have to choose bar indices from stars + bars total.
                let choose = self.castle_points.len() as u32 - 1; // Bars (castle dividers).
                let total = self.num_soldiers + choose; // Stars (soldiers) + bars.
                let mut prev_index = -1;
                // Knuth's algorithm:
                let mut chosen = 0;
                for i in 0..total {
                    if chosen >= choose {
                        break;
                    }
                    let remaining = total - i;
                    let needed = choose - chosen;
                    if Math::random() < needed as f64 / remaining as f64 {
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
            })
            .collect()
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
                let p1 = self.roulette_select(previous_generation, &cumulative_sum);
                let p2 = self.roulette_select(previous_generation, &cumulative_sum);
                // Crossover.
                let mut child = self.cross_over(p1, p2);
                // Mutation.
                self.mutate(&mut child);
                child
            })
            .collect()
    }

    fn evaluate(&self, individuals: Vec<Individual>) -> Vec<IndividualResult> {
        let mut scores = vec![0; individuals.len()];
        // Evaluate every pair.
        for i in 0..individuals.len() {
            for j in i + 1..individuals.len() {
                let i1 = &individuals[i];
                let i2 = &individuals[j];
                let (s1, s2) = i1.battle(i2, &self.castle_points);
                match self.scoring {
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

    fn roulette_select(
        &self,
        previous_generation: &[IndividualResult],
        cumulative_sum: &[u32],
    ) -> &Individual {
        todo!();
    }

    fn cross_over(&self, p1: &Individual, p2: &Individual) -> Individual {
        todo!();
    }

    fn mutate(&self, individual: &mut Individual) {
        todo!();
    }

    fn flatten_for_wasm(results: &[IndividualResult]) -> Vec<u32> {
        results
            .iter()
            .flat_map(|r| {
                let mut flattened = r.details.soldier_distribution.clone();
                flattened.push(r.score);
                flattened
            })
            .collect()
    }
}

#[wasm_bindgen]
pub enum Scoring {
    Wins = 0,
    Points = 1,
}

#[derive(Debug, PartialEq)]
struct IndividualResult {
    details: Individual,
    score: u32,
}

#[derive(Debug, PartialEq)]
struct Individual {
    soldier_distribution: Vec<u32>,
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
