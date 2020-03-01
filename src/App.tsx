import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ExpandCollapseItem } from './config/ExpandCollapseItem';
import { PuzzleDescription } from './config/PuzzleDescription';

const useStyles = makeStyles({
  root: {
    width: '90%',
    margin: 'auto'
  }
});

function App() {
  const classes = useStyles();
  const [castlePoints, setCastlePoints] = useState(Array.from(Array(10).keys()).map(x => x + 1));

  const handleNumCastlesChanged = (e: any) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2) {
      if (value < castlePoints.length) {
        setCastlePoints(castlePoints.slice(0, value));
      } else if (value > castlePoints.length) {
        const zeroed = Array(value - castlePoints.length).fill(0);
        setCastlePoints(castlePoints.concat(zeroed));
      }
    }
  }

  const handleCastlePointChanged = (e: any, i: number) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      const copy = [...castlePoints];
      copy[i] = value;
      setCastlePoints(copy);
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>Castles Puzzle Genetic Algorithm Visualiser</Typography>
      <Grid container>
        <Grid item xs={4}>
          <List>
            <ExpandCollapseItem header="Description" expand={true}>
              <PuzzleDescription castlePoints={castlePoints} />
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Puzzle Options" expand={false}>
              <div>
                <TextField
                  label="Number of castles"
                  type="number"
                  value={castlePoints.length}
                  onChange={handleNumCastlesChanged}
                />
              </div>
              {castlePoints.map((n, i) => <TextField key={i}
                label={`Castle ${i + 1}`}
                type="number"
                value={n}
                onChange={e => handleCastlePointChanged(e, i)}
              />)}
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Genetic Algorithm Options" expand={false}>
              test2
            </ExpandCollapseItem>
          </List>
        </Grid>
        <Grid item xs={8}>
          <Grid container justify="flex-end">
            <Button variant="contained" color="primary">Run Iteration</Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
