import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { GAActionsRow } from './GAActionsRow';
import { generateRandomIndividuals, evaluatePopulation } from './util';

const useStyles = makeStyles({
  slider: {
    width: '150px'
  },
  results: {
    marginTop: '32px'
  }
});

type GenerationResult = {
  population: number[][],
  scores: number[],
  castlePoints: number[] // Victory points snapshotted at the time of the first generation.
}

type GAVisualizerProps = {
  castlePoints: number[],
  numSoldiers: number
}

export function GAVisualizer({ numSoldiers, castlePoints }: GAVisualizerProps) {
  const classes = useStyles();
  const [generation, setGeneration] = useState<GenerationResult | undefined>(undefined);

  const handleReset = () => {
    setGeneration(undefined);
  }

  const handleStep = () => {
    if (generation === undefined) {
      const population = generateRandomIndividuals(100, numSoldiers, castlePoints.length);
      const scores = evaluatePopulation(population, castlePoints);
      setGeneration({
        population: population,
        castlePoints: castlePoints,
        scores: scores
      });
    }
  }

  return <>
    <Grid container justify="flex-end">
      <GAActionsRow
        onReset={handleReset}
        onStep={handleStep}
      />
    </Grid>
    {generation !== undefined &&
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