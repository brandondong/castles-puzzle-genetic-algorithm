use super::*;
use rand;

struct TestRandom;

impl RandomProvider for TestRandom {
    fn random(&self) -> f64 {
        rand::random()
    }
}

#[test]
fn test_generate_random_individuals() {
    for num_soldiers in 1..10 {
        for num_castles in 3..10 {
            let individual = uniform_random_individual(num_castles, num_soldiers, &TestRandom);
            let total_soldiers: u32 = individual.soldier_distribution.iter().sum();
            assert_eq!(total_soldiers, num_soldiers);
        }
    }
}

#[test]
fn test_roulette_select() {
    let prev_results = vec![
        IndividualResult {
            details: Individual {
                soldier_distribution: vec![1, 2],
            },
            score: 3,
        },
        IndividualResult {
            details: Individual {
                soldier_distribution: vec![2, 1],
            },
            score: 2,
        },
        IndividualResult {
            details: Individual {
                soldier_distribution: vec![3, 0],
            },
            score: 1,
        },
    ];
    let cumulative_sum = vec![3, 5, 6];
    for _ in 0..10 {
        // Can't really assert any properties, just ensure no panic.
        roulette_select(&prev_results, &cumulative_sum, &TestRandom);
    }
}

#[test]
fn test_pair_battle() {
    let i1 = Individual {
        soldier_distribution: vec![1, 2],
    };
    let i2 = Individual {
        soldier_distribution: vec![2, 1],
    };
    let castle_points = [5, 10];
    assert_eq!(i1.battle(&i2, &castle_points), (10, 5));
    assert_eq!(i2.battle(&i1, &castle_points), (5, 10));
    assert_eq!(i2.battle(&i2, &castle_points), (0, 0));
}

#[test]
fn test_evaluate_individuals_wars_won() {
    let individuals = vec![
        Individual {
            soldier_distribution: vec![1, 2],
        },
        Individual {
            soldier_distribution: vec![2, 1],
        },
        Individual {
            soldier_distribution: vec![0, 3],
        },
    ];
    let castle_points = vec![5, 10];
    let results = evaluate(individuals, &castle_points, &Scoring::Wins);
    assert_eq!(
        results,
        vec![
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![0, 3],
                },
                score: 2
            },
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![1, 2],
                },
                score: 1
            },
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![2, 1],
                },
                score: 0
            }
        ]
    );
}

#[test]
fn test_evaluate_individuals_points() {
    let individuals = vec![
        Individual {
            soldier_distribution: vec![1, 2],
        },
        Individual {
            soldier_distribution: vec![2, 1],
        },
        Individual {
            soldier_distribution: vec![0, 3],
        },
    ];
    let castle_points = vec![5, 10];
    let results = evaluate(individuals, &castle_points, &Scoring::Points);
    assert_eq!(
        results,
        vec![
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![0, 3],
                },
                score: 20
            },
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![1, 2],
                },
                score: 15
            },
            IndividualResult {
                details: Individual {
                    soldier_distribution: vec![2, 1],
                },
                score: 10
            }
        ]
    );
}
