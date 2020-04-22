import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { GeneticAlgorithm } from "wasm";

import { GAActionsRow } from './GAActionsRow';
import { generateRandomIndividuals, evaluatePopulation } from './util';

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
  numSoldiers: number
}

export function GAVisualizer({ numSoldiers, castlePoints }: GAVisualizerProps) {
  const classes = useStyles();
  const [algorithm, setAlgorithm] = useState<GeneticAlgorithm | undefined>(undefined);

  const handleReset = () => {
    if (algorithm !== undefined) {
      algorithm.free();
    }
    setAlgorithm(undefined);
  }

  const handleStep = () => {
    if (algorithm === undefined) {
      const population = generateRandomIndividuals(100, numSoldiers, castlePoints.length);
      const scores = evaluatePopulation(population, castlePoints);
      wasm.then(wasm => {
        const algorithm = wasm.GeneticAlgorithm.new();
        alert(algorithm.run_generation());
        setAlgorithm(algorithm);
      });
    } else {
      alert(algorithm.run_generation());
    }
  }

  return <>
    <Grid container justify="flex-end">
      <GAActionsRow
        onReset={handleReset}
        onStep={handleStep}
      />
    </Grid>
    {algorithm !== undefined &&
      <>
        <Grid className={classes.results} container justify="flex-end">
          <div>
            <Typography gutterBottom>Highlight best N:</Typography>
            <Slider
              className={classes.slider}
              defaultValue={30}
              valueLabelDisplay="auto"
              step={1}
              min={1}
              max={100}
            />
          </div>
        </Grid>
      </>}
  </>;
}