export class GenerationResult {
  populationSize: number;
  constructor(data: Uint32Array, populationSize: number) {
    this.populationSize = populationSize;
  }

  numIndividuals() {
    return this.populationSize;
  }
}