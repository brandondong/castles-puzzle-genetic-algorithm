import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { MinConstraintInput } from './Inputs';

const useStyles = makeStyles({
  numberInput: {
    margin: '8px'
  }
});

type GAOptionsProps = {
  populationSize: number,
  onPopulationSizeChange: (populationSize: number) => void
}

export function GAOptions({ populationSize, onPopulationSizeChange }: GAOptionsProps) {
  const classes = useStyles();
  return <>
    <MinConstraintInput
      className={classes.numberInput}
      label="Population size"
      defaultValue={populationSize}
      onChange={onPopulationSizeChange}
      min={2}
    />
  </>;
}