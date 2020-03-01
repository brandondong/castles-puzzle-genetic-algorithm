import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { ExpandCollapseItem } from './config/ExpandCollapseItem';

const useStyles = makeStyles({
  root: {
    width: '90%',
    margin: 'auto'
  },
  spacing: {
    marginBottom: '32px'
  }
});

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>Castles Puzzle Genetic Algorithm Visualiser</Typography>
      <Grid container>
        <Grid item xs={4}>
          <List>
            <ExpandCollapseItem header="Description" expand={true}>
              <Typography className={classes.spacing} variant="subtitle2">The following puzzle is from <a href="https://fivethirtyeight.com/features/can-you-rule-riddler-nation/" target="_blank" rel="noopener noreferrer">FiveThirtyEight</a>:</Typography>
              <Typography gutterBottom>In a distant, war-torn land, there are 10 castles. There are two warlords: you and your archenemy.</Typography>
              <Typography gutterBottom>Each castle has its own strategic value for a would-be conqueror. Specifically, the castles are worth 1, 2, 3, …, 9, and 10 victory points.</Typography>
              <Typography gutterBottom>You and your enemy each have 100 soldiers to distribute, any way you like, to fight at any of the 10 castles. Whoever sends more soldiers to a given castle conquers that castle and wins its victory points. If you each send the same number of troops, you split the points.</Typography>
              <Typography gutterBottom>You don’t know what distribution of forces your enemy has chosen until the battles begin.</Typography>
              <Typography gutterBottom>Whoever wins the most points wins the war.</Typography>
              <Divider className={classes.spacing} />
              <Typography gutterBottom>The above battle royale will be played out amongst 100 bots. After all possible one-on-one matchups are finished, the bots will be evaluated by the number of wars won.</Typography>
              <Typography gutterBottom>Selection, crossover, and mutation will be applied accordingly using this metric.</Typography>
              <Typography>Visualisations will track how the population evolves over time.</Typography>
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Puzzle Options" expand={false}>
              test1
            </ExpandCollapseItem>
            <Divider />
            <ExpandCollapseItem header="Genetic Algorithm Options" expand={false}>
              test2
            </ExpandCollapseItem>
          </List>
        </Grid>
        <Grid item xs={8}>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
