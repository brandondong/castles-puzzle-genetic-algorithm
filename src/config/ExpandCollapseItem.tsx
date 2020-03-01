import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles({
  listItem: {
    backgroundColor: 'white'
  },
  expandSection: {
    backgroundColor: 'white',
    padding: '16px',
    paddingBottom: '32px'
  }
});

type ExpandCollapseItemProps = {
  header: string,
  defaultExpand: boolean,
  children: React.ReactNode
}

export function ExpandCollapseItem({ defaultExpand, header, children }: ExpandCollapseItemProps) {
  const classes = useStyles();
  const [expand, setExpand] = useState(defaultExpand);

  const handleExpand = () => {
    setExpand(!expand);
  }
  return <>
    <ListItem className={classes.listItem} button onClick={handleExpand}>
      <ListItemText primary={header} />
      {expand ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={expand} timeout="auto">
      <div className={classes.expandSection}>{children}</div>
    </Collapse>
  </>;
}