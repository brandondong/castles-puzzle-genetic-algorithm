import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { ExpandCollapseItem } from './config/ExpandCollapseItem';
import { PuzzleDescription } from './config/PuzzleDescription';
import { PuzzleOptions } from './config/PuzzleOptions';

const useStyles = makeStyles({
  root: {
    width: '90%',
    margin: 'auto'
  }
});

function App() {
  const classes = useStyles();
  const [castlePoints, setCastlePoints] = useState(Array.from(Array(10).keys()).map(x => x + 1));

  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>Castles Puzzle Genetic Algorithm Visualiser</Typography>
      <Grid container>
        <Grid item xs={4}>
          <List>
            <ExpandCollapseItem header="Description" defaultExpand={true}>
              <PuzzleDescription castlePoints={castlePoints} />
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Puzzle Options" defaultExpand={false}>
              <PuzzleOptions castlePoints={castlePoints} onCastlePointsChange={setCastlePoints} />
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Genetic Algorithm Options" defaultExpand={false}>
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
