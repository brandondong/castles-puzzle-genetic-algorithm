import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  button: {
    margin: '8px'
  }
});

type GAActionsRowProps = {
  onReset: () => void,
  onPause: () => void,
  onRun: () => void,
  onStep: () => void
}

export function GAActionsRow({ onReset, onPause, onRun, onStep }: GAActionsRowProps) {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const handleReset = () => {
    setIsRunning(false);
    setGeneration(0);
    onReset();
  }

  const handleStep = () => {
    setGeneration(generation + 1);
    onStep();
  }

  const handleRunPause = () => {
    const nextIsRunning = !isRunning;
    setIsRunning(nextIsRunning);
    if (nextIsRunning) {
      onRun();
    } else {
      onPause();
    }
  }

  return <Grid container justify={generation === 0 ? 'flex-end' : 'space-between'}>
    {generation !== 0 &&
      <Button
        className={classes.button}
        onClick={() => {
          if (isRunning) {
            handleRunPause();
          } else {
            handleStep();
          }
        }}>{`Generation ${generation}`}</Button>}
    <div>
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
    </div>
  </Grid>;
}