import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

type MinConstraintInputProps = {
  min: number,
  onChange: (value: number) => void,
  // Manually add pass through props because TextField props type prevents us from extending the type directly.
  className?: string,
  label: string,
  defaultValue: number
}

export function MinConstraintInput(props: MinConstraintInputProps) {
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