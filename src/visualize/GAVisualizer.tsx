import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  button: {
    margin: '8px'
  }
});

export function GAVisualizer() {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const handleReset = () => {
    setIsRunning(false);
    setGeneration(0);
  }

  const handleStep = () => {
    setGeneration(generation + 1);
  }

  const handleRunPause = () => {
    setIsRunning(!isRunning)
  }

  return <>
    <Grid container justify="flex-end">
      <Button
        className={classes.button}
        disabled={generation === 0}
        variant="outlined"
        color="primary"
        onClick={() => handleReset()}>Reset</Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={() => handleRunPause()}>
        {isRunning ? 'Pause' : 'Run'}
      </Button>
      <Button
        className={classes.button}
        disabled={isRunning}
        variant="contained"
        color="secondary"
        onClick={() => handleStep()}>Step</Button>
    </Grid>
    {generation !== 0 &&
      <Typography variant="h6">{`Generation ${generation}:`}</Typography>}
  </>;
}