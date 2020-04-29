import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ExpandCollapsePanel } from './config/ExpandCollapsePanel';
import { PuzzleDescription } from './config/PuzzleDescription';
import { PuzzleOptions } from './config/PuzzleOptions';
import { GAOptions } from './config/GAOptions';
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

// Must match wasm definition.
export enum Scoring {
  Wins = 0,
  Points = 1,
}

function App() {
  const classes = useStyles();
  const [numSoldiers, setNumSoldiers] = useState(100);
  const [castlePoints, setCastlePoints] = useState(Array.from(Array(10).keys()).map(x => x + 1));
  const [populationSize, setPopulationSize] = useState(100);
  const [scoring, setScoring] = useState(Scoring.Wins);

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h3">Castles Puzzle Genetic Algorithm Visualizer</Typography>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <ExpandCollapsePanel defaultExpanded={true} header="Overview">
            <PuzzleDescription
              castlePoints={castlePoints}
              numSoldiers={numSoldiers}
              populationSize={populationSize}
              scoring={scoring}
            />
          </ExpandCollapsePanel>
          <ExpandCollapsePanel defaultExpanded={false} header="Puzzle Options">
            <PuzzleOptions
              castlePoints={castlePoints}
              onCastlePointsChange={setCastlePoints}
              numSoldiers={numSoldiers}
              onNumSoldiersChange={setNumSoldiers}
              scoring={scoring}
              onScoringChange={setScoring}
            />
          </ExpandCollapsePanel>
          <ExpandCollapsePanel defaultExpanded={false} header="Genetic Algorithm Options">
            <GAOptions
              populationSize={populationSize}
              onPopulationSizeChange={setPopulationSize}
            />
          </ExpandCollapsePanel>
        </Grid>
        <Grid item xs={8}>
          <GAVisualizer
            castlePoints={castlePoints}
            numSoldiers={numSoldiers}
            populationSize={populationSize}
            scoring={scoring}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
