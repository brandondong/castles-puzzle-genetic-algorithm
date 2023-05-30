mod ga;

use clap::Parser;

use ga::{GeneticAlgorithm, Scoring};

#[derive(Parser, Debug)]
struct Args {
    #[arg(long, default_value_t = 0)]
    scoring: u8,
    #[arg(short, long, default_value_t = 10)]
    generations: u32,
    #[arg(short, long, default_value_t = 1000)]
    population: u32,
    #[arg(short, long, default_value_t = 10)]
    castles: u32,
    #[arg(short, long, default_value_t = 100)]
    soldiers: u32,
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

    let mut ga = GeneticAlgorithm::new(args.population, castle_points, args.soldiers, scoring);
    for generation in 1..=args.generations {
        let results = ga.run_generation();
        let best = &results[0];
        println!(
            "Generation {generation} winner: score={}, strategy={:?}",
            best.score, best.details.soldier_distribution
        );
    }
}
