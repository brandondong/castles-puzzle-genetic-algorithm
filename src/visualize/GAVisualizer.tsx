import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { GAActionsRow } from './GAActionsRow';

const useStyles = makeStyles({
  slider: {
    width: '150px'
  },
  results: {
    marginTop: '32px'
  }
});

export function GAVisualizer() {
  const classes = useStyles();

  const handleReset = () => {
    console.log('reset');
  }

  const handleStep = () => {
    console.log('step');
  }

  const handlePause = () => {
    console.log('pause');
  }

  const handleRun = () => {
    console.log('run');
  }

  return <>
    <GAActionsRow
      onPause={handlePause}
      onReset={handleReset}
      onStep={handleStep}
      onRun={handleRun}
    />
    {false &&
      <>
        <Grid className={classes.results} container justify="flex-end">
          <div>
            <Typography gutterBottom>Overlay best N:</Typography>
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