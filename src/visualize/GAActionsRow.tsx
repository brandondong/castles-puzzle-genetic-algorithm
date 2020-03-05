import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  button: {
    margin: '8px'
  }
});

type GAActionsRowProps = {
  onReset: () => void,
  onStep: () => void
}

export function GAActionsRow({ onReset, onStep }: GAActionsRowProps) {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const handleReset = () => {
    setIsRunning(false);
    setGeneration(0);
    onReset();
  }

  const handleStep = () => {
    setGeneration(generation => generation + 1);
    onStep();
  }

  const handleRunPause = () => {
    const nextIsRunning = !isRunning;
    setIsRunning(nextIsRunning);
    if (nextIsRunning) {
      handleStep();
    }
  }

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setGeneration(generation => generation + 1);
        onStep();
      }, 1000);
      return () => {
        clearInterval(timer);
      }
    }
  }, [isRunning, setGeneration, onStep]);

  return <>
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
  </>;
}