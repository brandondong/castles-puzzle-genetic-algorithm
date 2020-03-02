import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

type ExpandCollapsePanelProps = {
  header: string,
  defaultExpanded: boolean,
  children: React.ReactNode
}

export function ExpandCollapsePanel({ defaultExpanded, header, children }: ExpandCollapsePanelProps) {
  return <ExpansionPanel defaultExpanded={defaultExpanded}>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}>
      <Typography>{header}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <div>{children}</div>
    </ExpansionPanelDetails>
  </ExpansionPanel>
}