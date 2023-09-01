mod ga;
mod util;

use clap::Parser;
use ga::{GeneticAlgorithm, Scoring};

#[derive(Parser, Debug)]
struct Args {
    #[arg(short, long, default_value_t = 50)]
    generations: u32,
    #[arg(short, long, default_value_t = 1000)]
    population: u32,
    #[arg(short, long, default_value_t = 10)]
    castles: u32,
    #[arg(short, long, default_value_t = 100)]
    soldiers: u32,
    #[arg(long, default_value_t = 0)]
    scoring: u8,
    #[arg(long, default_value_t = 0.1)]
    mutation: f64,
}

fn main() {
    let args: Args = Args::parse();
    let scoring = match args.scoring {
        0 => Scoring::Wins,
        1 => Scoring::Points,
        unknown => {
            eprintln!("Invalid scoring type: {unknown}");
            return;
        }
    };
    let castle_points = (1..=args.castles).collect();

    let mut ga = GeneticAlgorithm::new(
        args.population,
        castle_points,
        args.soldiers,
        scoring,
        args.mutation,
    );
    let mut prev_best: Option<Vec<u32>> = None;
    for generation in 1..=args.generations {
        let results = ga.run_generation();
        let best = &results[0];
        let change = match prev_best {
            None => String::from("N/A"),
            Some(i) => i
                .iter()
                .zip(&best.details.soldier_distribution)
                .map(|(i, j)| i.abs_diff(*j))
                .sum::<u32>()
                .to_string(),
        };

        println!(
            "Generation {generation} winner: score={}, strategy={:?}, change={}",
            best.score, best.details.soldier_distribution, change
        );
        prev_best = Some(best.details.soldier_distribution.clone());
    }
}
