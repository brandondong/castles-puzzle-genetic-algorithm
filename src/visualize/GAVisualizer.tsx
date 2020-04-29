import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { WasmGeneticAlgorithm } from "wasm";

import { GAActionsRow } from './GAActionsRow';

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
}

export function GAVisualizer({ numSoldiers, castlePoints, populationSize }: GAVisualizerProps) {
  const classes = useStyles();
  const [algorithm, setAlgorithm] = useState<WasmGeneticAlgorithm | undefined>(undefined);

  const handleReset = () => {
    if (algorithm !== undefined) {
      algorithm.free();
    }
    setAlgorithm(undefined);
  }

  const handleStep = () => {
    if (algorithm === undefined) {
      wasm.then(wasm => {
        const algorithm = wasm.WasmGeneticAlgorithm.new(populationSize, Uint32Array.from(castlePoints), numSoldiers, wasm.Scoring.Points);
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