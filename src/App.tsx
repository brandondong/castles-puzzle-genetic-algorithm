import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  root: {
    width: '80%',
    margin: 'auto'
  },
  listItem: {
    backgroundColor: 'white'
  }
});

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6}>
          <List>
            <ExpandCollapseItem header="Description" />
            <Divider />
            <ExpandCollapseItem header="Puzzle Options" />
            <Divider />
            <ExpandCollapseItem header="Genetic Algorithm Options" />
          </List>
        </Grid>
        <Grid item xs={6}>
        </Grid>
      </Grid>
    </div>
  );
}

type ExpandCollapseItemProps = {
  header: string
}

function ExpandCollapseItem({ header }: ExpandCollapseItemProps) {
  const classes = useStyles();
  const [expand, setExpand] = useState(true);

  const handleExpand = () => {
    setExpand(!expand);
  }
  return <ListItem className={classes.listItem} button onClick={handleExpand}>
    <ListItemText primary={header} />
    {expand ? <ExpandLess /> : <ExpandMore />}
  </ListItem>;
}

export default App;
