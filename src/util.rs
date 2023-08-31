use rand::Rng;

pub fn random_sample<T, I, E, F, R>(iter: I, mut num_choose: usize, mut f: F, rng: &mut R)
where
    I: IntoIterator + IntoIterator<IntoIter = E>,
    E: Iterator<Item = T> + ExactSizeIterator,
    F: FnMut(T),
    R: Rng,
{
    // Knuth's algorithm:
    let iter = iter.into_iter();
    let mut total = iter.len();
    assert!(num_choose <= total);

    for val in iter {
        if num_choose == 0 {
            break;
        }
        // Yes with probability = num_choose/total.
        if rng.gen_range(1..=total) <= num_choose {
            f(val);
            num_choose -= 1;
        }
        total -= 1;
    }
}

#[cfg(test)]
mod tests {
    use rand::thread_rng;

    use super::*;

    #[test]
    fn test_sample_all() {
        for i in 0..10 {
            let mut count = 0;
            random_sample(
                0..i,
                i,
                |v| {
                    assert_eq!(count, v);
                    count += 1;
                },
                &mut thread_rng(),
            );
            assert_eq!(i, count);
        }
    }

    #[test]
    fn test_sample_length() {
        for i in 0..10 {
            let mut count = 0;
            let choose = i / 2;
            random_sample(0..i, choose, |_v| count += 1, &mut thread_rng());
            assert_eq!(choose, count);
        }
    }
}
