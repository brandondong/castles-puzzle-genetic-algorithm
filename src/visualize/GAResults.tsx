import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { GenerationResult } from './GenerationResult';
import { ScoreHistogram } from './ScoreHistogram';

const useStyles = makeStyles({
  slider: {
    width: '150px'
  },
  scoreContainer: {
    flexGrow: 1,
    height: '300px',
    overflow: 'auto'
  },
  scoreRow: {
    display: 'flex'
  }
});

type GAResultsProps = {
  result: GenerationResult
}

export function GAResults({ result }: GAResultsProps) {
  const classes = useStyles();
  const populationSize = result.populationSize;
  const [bestN, setBestN] = useState(Math.ceil(populationSize / 4));

  const handleBestNChange = (event: any, newValue: number | number[]) => {
    setBestN(newValue as number);
  };

  return <>
    <div className={classes.scoreRow}>
      <div className={classes.scoreContainer}>
        <ScoreHistogram result={result} />
      </div>
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
    </div>
  </>;
}