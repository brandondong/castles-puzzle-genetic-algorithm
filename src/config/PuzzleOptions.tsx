import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  numCastlesInput: {
    margin: '8px'
  },
  castlePointsInput: {
    margin: '8px',
    width: '80px'
  }
});

type PuzzleOptionsProps = {
  castlePoints: number[],
  onCastlePointsChange: (castlePoints: number[]) => void
}

export function PuzzleOptions({ castlePoints, onCastlePointsChange }: PuzzleOptionsProps) {
  const classes = useStyles();

  const handleNumCastlesChanged = (value: number) => {
    if (value < castlePoints.length) {
      onCastlePointsChange(castlePoints.slice(0, value));
    } else if (value > castlePoints.length) {
      const zeroed = Array(value - castlePoints.length).fill(0);
      onCastlePointsChange(castlePoints.concat(zeroed));
    }
  }

  const handleCastlePointChanged = (value: number, i: number) => {
    const copy = [...castlePoints];
    copy[i] = value;
    onCastlePointsChange(copy);
  }

  return <>
    <div className={classes.numCastlesInput}>
      <MinConstraintInput
        label="Number of castles"
        defaultValue={castlePoints.length}
        onChange={handleNumCastlesChanged}
        min={2}
      />
    </div>
    {castlePoints.map((n, i) => <MinConstraintInput key={i}
      className={classes.castlePointsInput}
      label={`Castle ${i + 1}`}
      defaultValue={n}
      onChange={(value: number) => handleCastlePointChanged(value, i)}
      min={0}
    />)}
  </>;
}

function MinConstraintInput(props: any) {
  const [error, setError] = useState(false);

  const { min, onChange, ...rest } = props;

  const handleChanged = (e: any) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min) {
      onChange(value);
      setError(false);
    } else {
      setError(true);
    }
  }
  return <TextField
    type="number"
    onChange={handleChanged}
    error={error}
    InputLabelProps={{
      shrink: true,
    }}
    {...rest} />;
}