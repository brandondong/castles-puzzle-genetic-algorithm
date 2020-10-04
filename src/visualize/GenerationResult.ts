import { Scoring } from '../App';

export class GenerationResult {
  data: Uint32Array;
  populationSize: number;
  numCastles: number;
  scoring: Scoring;

  constructor(data: Uint32Array, populationSize: number, numCastles: number, scoring: Scoring) {
    this.data = data;
    this.populationSize = populationSize;
    this.numCastles = numCastles;
    this.scoring = scoring;
  }
}