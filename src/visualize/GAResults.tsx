import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { GenerationResult } from './GenerationResult';

const useStyles = makeStyles({
  slider: {
    width: '150px'
  }
});

type GAResultsProps = {
  result: GenerationResult
}

export function GAResults({ result }: GAResultsProps) {
  const classes = useStyles();
  const populationSize = result.numIndividuals();
  const [bestN, setBestN] = useState(Math.ceil(populationSize / 4));

  const handleBestNChange = (event: any, newValue: number | number[]) => {
    setBestN(newValue as number);
  };

  return <>
    <Grid container justify="flex-end">
      <div>
        <Typography gutterBottom>Highlight best N:</Typography>
        <Slider
          className={classes.slider}
          value={bestN}
          onChange={handleBestNChange}
          valueLabelDisplay="auto"
          step={1}
          min={1}
          max={populationSize}
        />
      </div>
    </Grid>
  </>;
}