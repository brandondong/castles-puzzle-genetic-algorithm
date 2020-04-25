use super::*;

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
    assert_eq!(
        GeneticAlgorithm::flatten_for_wasm(&results),
        vec![1, 2, 3, 4, 5, 6]
    );
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
    assert_eq!(i1.battle(&i2, &castle_points), BattleResult::Win);
    assert_eq!(i2.battle(&i1, &castle_points), BattleResult::Loss);
    assert_eq!(i2.battle(&i2, &castle_points), BattleResult::Tie);
}

#[test]
fn test_evaluate_individuals() {
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
    let ga = GeneticAlgorithm::new(3, castle_points, 3);
    let results = ga.evaluate(individuals);
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