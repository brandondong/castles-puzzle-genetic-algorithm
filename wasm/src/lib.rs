mod ga;
mod utils;

use ga::GeneticAlgorithm;
use ga::IndividualResult;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct WasmGeneticAlgorithm {
    algorithm: GeneticAlgorithm,
}

#[wasm_bindgen]
impl WasmGeneticAlgorithm {
    pub fn new(
        num_individuals: u32,
        castle_points: Vec<u32>,
        num_soldiers: u32,
        scoring: Scoring,
    ) -> Self {
        utils::set_panic_hook();
        Self {
            algorithm: GeneticAlgorithm::new(num_individuals, castle_points, num_soldiers, scoring),
        }
    }

    /// Runs the next generation, returning details about the individuals and their scores achieved.    
    pub fn run_generation(&mut self) -> Vec<u32> {
        flatten_for_wasm(self.algorithm.run_generation())
    }

    pub fn num_individuals(&self) -> u32 {
        self.algorithm.num_individuals
    }

    pub fn num_castles(&self) -> usize {
        self.algorithm.castle_points.len()
    }

    pub fn scoring(&self) -> Scoring {
        self.algorithm.scoring
    }
}

/// Results are flattened in order to be passed back out of wasm.
/// The format is [individual 1 castle 1 soldiers, i1c2, ..., i1 score, i2c1, ...].
fn flatten_for_wasm(results: &[IndividualResult]) -> Vec<u32> {
    match results.iter().next() {
        None => vec![],
        Some(result) => {
            let mut output =
                Vec::with_capacity(results.len() * (result.details.soldier_distribution.len() + 1));
            for r in results {
                for &n in &r.details.soldier_distribution {
                    output.push(n);
                }
                output.push(r.score);
            }
            output
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum Scoring {
    Wins = 0,
    Points = 1,
}

#[cfg(test)]
mod tests {
    use super::*;
    use ga::Individual;

    #[test]
    fn test_flatten() {
        let results = vec![
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![1, 2],
                },
                score: 3,
            },
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![4, 5],
                },
                score: 6,
            },
        ];
        assert_eq!(flatten_for_wasm(&results), vec![1, 2, 3, 4, 5, 6]);
    }
}
