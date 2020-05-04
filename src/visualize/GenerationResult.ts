import { Scoring } from '../App';

export class GenerationResult {
  populationSize: number;
  scoring: Scoring;

  constructor(data: Uint32Array, populationSize: number, scoring: Scoring) {
    this.populationSize = populationSize;
    this.scoring = scoring;
  }
}