mod utils;

use js_sys::Math;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct GeneticAlgorithm {}

#[wasm_bindgen]
impl GeneticAlgorithm {
    pub fn new() -> GeneticAlgorithm {
        GeneticAlgorithm {}
    }

    pub fn run_generation(&mut self) -> f64 {
        Math::random()
    }
}
