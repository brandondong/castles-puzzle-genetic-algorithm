import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  spacing: {
    marginBottom: '32px'
  }
});

type PuzzleDescriptionProps = {
  castlePoints: number[],
  numSoldiers: number
}

function formattedCastlePoints(castlePoints: number[]) {
  let s = '';
  for (let i = 0; i < castlePoints.length - 1; i++) {
    s += castlePoints[i] + ', ';
  }
  s += 'and ' + castlePoints[castlePoints.length - 1];
  return s;
}

export function PuzzleDescription({ castlePoints, numSoldiers }: PuzzleDescriptionProps) {
  const classes = useStyles();

  const numCastles = castlePoints.length;
  return <>
    <Typography className={classes.spacing} variant="subtitle2">The following puzzle is from <a href="https://fivethirtyeight.com/features/can-you-rule-riddler-nation/" target="_blank" rel="noopener noreferrer">FiveThirtyEight</a>:</Typography>
    <Typography gutterBottom>{`In a distant, war-torn land, there are ${numCastles} castles. There are two warlords: you and your archenemy.`}</Typography>
    <Typography gutterBottom>{`Each castle has its own strategic value for a would-be conqueror. Specifically, the castles are worth ${formattedCastlePoints(castlePoints)} victory points.`}</Typography>
    <Typography gutterBottom>{`You and your enemy each have ${numSoldiers} soldier${numSoldiers === 1 ? '' : 's'} to distribute, any way you like, to fight at any of the ${numCastles} castles. Whoever sends more soldiers to a given castle conquers that castle and wins its victory points. If you each send the same number of troops, you split the points.`}</Typography>
    <Typography gutterBottom>You don’t know what distribution of forces your enemy has chosen until the battles begin.</Typography>
    <Typography gutterBottom>Whoever wins the most points wins the war.</Typography>
    <Divider className={classes.spacing} />
    <Typography gutterBottom>The above battle royale will be played out amongst 100 bots. After all possible one-on-one matchups are finished, the bots will be evaluated by the number of wars won.</Typography>
    <Typography gutterBottom>Selection, crossover, and mutation will be applied accordingly using this metric.</Typography>
    <Typography>Visualizations will track how the population evolves over time.</Typography>
  </>;
}