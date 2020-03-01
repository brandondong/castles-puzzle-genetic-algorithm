import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  numberInput: {
    margin: '8px'
  },
  castlePointsInput: {
    margin: '8px',
    width: '80px'
  }
});

type PuzzleOptionsProps = {
  castlePoints: number[],
  onCastlePointsChange: (castlePoints: number[]) => void,
  numSoldiers: number,
  onNumSoldiersChange: (numSoldiers: number) => void
}

export function PuzzleOptions({ castlePoints, onCastlePointsChange, numSoldiers, onNumSoldiersChange }: PuzzleOptionsProps) {
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
    <div>
      <MinConstraintInput
        className={classes.numberInput}
        label="Number of soldiers"
        defaultValue={numSoldiers}
        onChange={onNumSoldiersChange}
        min={1}
      />
    </div>
    <div>
      <MinConstraintInput
        className={classes.numberInput}
        label="Number of castles"
        defaultValue={castlePoints.length}
        onChange={handleNumCastlesChanged}
        min={2}
      />
    </div>
    {castlePoints.map((n, i) => <MinConstraintInput key={i}
      className={classes.castlePointsInput}
      label={`C${i + 1} points`}
      defaultValue={n}
      onChange={(value: number) => handleCastlePointChanged(value, i)}
      min={0}
    />)}
  </>;
}

type MinConstraintInputProps = {
  min: number,
  onChange: (value: number) => void,
  // Manually add pass through props because TextField props type prevents us from extending the type directly.
  className?: string,
  label: string,
  defaultValue: number
}

function MinConstraintInput(props: MinConstraintInputProps) {
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