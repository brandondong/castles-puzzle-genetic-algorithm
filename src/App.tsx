import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { ExpandCollapseItem } from './config/ExpandCollapseItem';
import { PuzzleDescription } from './config/PuzzleDescription';
import { PuzzleOptions } from './config/PuzzleOptions';
import { GAVisualizer } from './visualize/GAVisualizer';

const useStyles = makeStyles({
  root: {
    width: '90%',
    margin: 'auto'
  },
  title: {
    marginBottom: '32px'
  }
});

function App() {
  const classes = useStyles();
  const [numSoldiers, setNumSoldiers] = useState(100);
  const [castlePoints, setCastlePoints] = useState(Array.from(Array(10).keys()).map(x => x + 1));

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h3">Castles Puzzle Genetic Algorithm Visualizer</Typography>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <List>
            <ExpandCollapseItem header="Description" defaultExpand={true}>
              <PuzzleDescription castlePoints={castlePoints} numSoldiers={numSoldiers} />
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Puzzle Options" defaultExpand={false}>
              <PuzzleOptions
                castlePoints={castlePoints}
                onCastlePointsChange={setCastlePoints}
                numSoldiers={numSoldiers}
                onNumSoldiersChange={setNumSoldiers}
              />
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Genetic Algorithm Options" defaultExpand={false}>
              WIP
            </ExpandCollapseItem>
          </List>
        </Grid>
        <Grid item xs={8}>
          <GAVisualizer />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
