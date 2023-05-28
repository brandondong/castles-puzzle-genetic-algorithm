use super::*;

#[test]
fn test_end_to_end() {
    let mut ga = GeneticAlgorithm::new(5, vec![1, 2, 3], 10, Scoring::Wins);
    for _ in 0..10 {
        let results = ga.run_generation();
        assert_eq!(results.len(), 5);
        for result in results {
            let total_soldiers: u32 = result.details.soldier_distribution.iter().sum();
            assert_eq!(total_soldiers, 10);
        }
    }
}

#[test]
fn test_generate_random_individuals() {
    for num_soldiers in 1..10 {
        for num_castles in 3..10 {
            let individual = uniform_random_individual(num_castles, num_soldiers);
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
    let cumulative_sum = vec![
        (3, &prev_results[0].details),
        (5, &prev_results[1].details),
        (6, &prev_results[2].details),
    ];
    for _ in 0..10 {
        // Can't really assert any properties, just ensure no panic.
        roulette_select(&prev_results, &cumulative_sum);
    }
}

#[test]
fn test_roulette_select_all_zero() {
    let prev_results = vec![
        IndividualResult {
            details: Individual {
                soldier_distribution: vec![1, 1],
            },
            score: 0,
        },
        IndividualResult {
            details: Individual {
                soldier_distribution: vec![1, 1],
            },
            score: 0,
        },
    ];
    roulette_select(&prev_results, &Vec::new());
}

#[test]
fn test_cross_over_no_rounding() {
    let i1 = Individual {
        soldier_distribution: vec![2, 2, 0],
    };
    let i2 = Individual {
        soldier_distribution: vec![2, 0, 2],
    };
    let child = crossover(&i1, &i2);
    assert_eq!(child.soldier_distribution, vec![2, 1, 1]);
}

#[test]
fn test_cross_over_rounding() {
    for _ in 0..10 {
        let i1 = Individual {
            soldier_distribution: vec![2, 3, 0],
        };
        let i2 = Individual {
            soldier_distribution: vec![2, 0, 3],
        };
        let s = crossover(&i1, &i2).soldier_distribution;
        assert_eq!(s[0], 2);
        assert!(s[1] == 1 && s[2] == 2 || s[1] == 2 && s[2] == 1);
    }
}

#[test]
fn test_mutate() {
    // First castle is worth the most points and the second is worth the least.
    let sorted_castles = vec![1, 2, 0];
    for _ in 0..10 {
        let mut i = Individual {
            soldier_distribution: vec![3, 3, 3],
        };
        mutate(&mut i, &sorted_castles);
        let soldiers = i.soldier_distribution;
        let total_soldiers: u32 = soldiers.iter().sum();
        assert_eq!(total_soldiers, 9);
        assert!(soldiers.iter().any(|&s| s == 3));
        // Must not have swapped between the first and second castles.
        assert!(soldiers[0] == 3 || soldiers[1] == 3);
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
    let results = evaluate(individuals, &castle_points, Scoring::Wins);
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
    let results = evaluate(individuals, &castle_points, Scoring::Points);
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
