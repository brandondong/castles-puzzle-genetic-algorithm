import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { WasmGeneticAlgorithm } from "wasm";

import { GAActionsRow } from './GAActionsRow';
import { Scoring } from '../App';
import { GenerationResult } from './GenerationResult';
import { GAResults } from './GAResults';

const wasm = import("wasm");

const useStyles = makeStyles({
  slider: {
    width: '150px'
  },
  results: {
    marginTop: '32px'
  }
});

type GAVisualizerProps = {
  castlePoints: number[],
  numSoldiers: number,
  populationSize: number,
  scoring: Scoring,
}

export function GAVisualizer({ numSoldiers, castlePoints, populationSize, scoring }: GAVisualizerProps) {
  const classes = useStyles();
  const [algorithm, setAlgorithm] = useState<WasmGeneticAlgorithm | undefined>(undefined);
  const [result, setResult] = useState<GenerationResult | undefined>(undefined);

  const handleReset = () => {
    if (algorithm !== undefined) {
      algorithm.free();
    }
    setAlgorithm(undefined);
    setResult(undefined);
  }

  const handleStep = () => {
    if (algorithm === undefined) {
      wasm.then(wasm => {
        const algorithm = wasm.WasmGeneticAlgorithm.new(populationSize, Uint32Array.from(castlePoints), numSoldiers, scoring);
        setAlgorithm(algorithm);
        const result = runGeneration(algorithm);
        setResult(result);
      });
    } else {
      const result = runGeneration(algorithm);
      setResult(result);
    }
  }

  return <>
    <Grid container justify="flex-end">
      <GAActionsRow
        onReset={handleReset}
        onStep={handleStep}
      />
    </Grid>
    {result !== undefined &&
      <div className={classes.results}>
        <GAResults result={result} />
      </div>}
  </>;
}

function runGeneration(algorithm: WasmGeneticAlgorithm) {
  const result = algorithm.run_generation();
  return new GenerationResult(result, algorithm.num_individuals(), algorithm.scoring());
}