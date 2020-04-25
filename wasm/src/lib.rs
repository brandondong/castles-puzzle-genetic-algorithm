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
}

#[wasm_bindgen]
impl GeneticAlgorithm {
    pub fn new(
        num_individuals: u32,
        castle_points: Vec<u32>,
        numSoldiers: u32,
    ) -> GeneticAlgorithm {
        GeneticAlgorithm {
            current_generation: None,
        }
    }

    /// Runs the next generation, returning details about the individuals and their scores achieved.
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
        todo!();
    }

    fn flatten_for_wasm(results: &[IndividualResult]) -> Vec<u32> {
        todo!();
    }
}

struct IndividualResult {
    details: Individual,
    score: u32,
}

struct Individual {
    soldier_distribution: Vec<u32>,
}
