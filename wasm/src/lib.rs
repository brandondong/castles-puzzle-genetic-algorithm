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
    castle_points: Vec<u32>,
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
            castle_points,
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
        todo!();
    }

    fn generation_from_previous(
        &self,
        previous_generation: &[IndividualResult],
    ) -> Vec<Individual> {
        todo!();
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

    fn flatten_for_wasm(results: &[IndividualResult]) -> Vec<u32> {
        results.iter().flat_map(|r| r.flatten_for_wasm()).collect()
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

impl IndividualResult {
    fn flatten_for_wasm(&self) -> Vec<u32> {
        let mut flattened = self.details.soldier_distribution.clone();
        flattened.push(self.score);
        flattened
    }
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
