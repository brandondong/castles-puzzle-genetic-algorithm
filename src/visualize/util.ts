export function generateRandomIndividuals(n: number, numSoldiers: number, numCastles: number) {
  const individuals = [];
  for (let i = 0; i < n; i++) {
    // Generate points from 0 to 1.
    const points = [];
    for (let i = 0; i < numCastles - 1; i++) {
      points.push(Math.random());
    }
    points.sort();
    // The distances between points are now our uniformly distributed values summing to 1.
    const values = [];
    values.push(Math.round(points[0] * numSoldiers));
    for (let i = 1; i < numCastles - 1; i++) {
      const difference = points[i] - points[i - 1];
      values.push(Math.round(difference * numSoldiers));
    }
    const sumWithoutLast = values.reduce((a, b) => a + b, 0);
    values.push(numSoldiers - sumWithoutLast);

    individuals.push(values);
  }
  return individuals;
}

export function evaluatePopulation(population: number[][], castlePoints: number[]) {
  const scores = [];
  for (let i = 0; i < population.length; i++) {
    const p1 = population[i];
    let plusMinus = 0;
    for (let j = 0; j < population.length; j++) {
      if (i !== j) {
        const p2 = population[j];
        plusMinus += scoreAgainst(p1, p2, castlePoints);
      }
    }
    scores.push(plusMinus);
  }
  return scores;
}

function scoreAgainst(p1: number[], p2: number[], castlePoints: number[]) {
  let p1Points = 0;
  let p2Points = 0;
  for (let i = 0; i < castlePoints.length; i++) {
    if (p1[i] > p2[i]) {
      p1Points += castlePoints[i];
    } else if (p1[i] < p2[i]) {
      p2Points += castlePoints[i];
    }
  }
  return p1Points > p2Points ? 1 :
    p1Points === p2Points ? 0 : -1;
}