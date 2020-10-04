import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { GenerationResult } from './GenerationResult';
import { ScoreHistogram } from './ScoreHistogram';

const useStyles = makeStyles({
});

type GAResultsProps = {
  result: GenerationResult
}

export function GAResults({ result }: GAResultsProps) {
  const classes = useStyles();
  const castleHeadings = [];
  for (let i = 0; i < result.numCastles; i++) {
    castleHeadings.push(<TableCell key={i} align="right">{`C${i + 1}`}</TableCell>);
  }

  const numTop = Math.min(5, result.populationSize);
  const topRows = [];
  for (let i = 0; i < numTop; i++) {
    const cells = [];
    for (let c = 0; c < (result.numCastles + 1); c++) {
      const index = i * (result.numCastles + 1) + c;
      cells.push(<TableCell key={c} align="right">{result.data[index]}</TableCell>)
    }
    topRows.push(<TableRow key={i}>
      <TableCell>{i + 1}</TableCell>
      {cells}
    </TableRow>);
  }

  return <div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ranking</TableCell>
            {castleHeadings}
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topRows}
        </TableBody>
      </Table>
    </TableContainer>
  </div>;
}