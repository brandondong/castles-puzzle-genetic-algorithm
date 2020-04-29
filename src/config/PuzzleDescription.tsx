import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  spacing: {
    marginBottom: '32px'
  },
  link: {
    color: 'rgb(0, 0, 238)'
  }
});

type PuzzleDescriptionProps = {
  castlePoints: number[],
  numSoldiers: number,
  populationSize: number,
}

function formattedCastlePoints(castlePoints: number[]) {
  let s = '';
  for (let i = 0; i < castlePoints.length - 1; i++) {
    s += castlePoints[i] + ', ';
  }
  s += 'and ' + castlePoints[castlePoints.length - 1];
  return s;
}

export function PuzzleDescription({ castlePoints, numSoldiers, populationSize }: PuzzleDescriptionProps) {
  const classes = useStyles();

  const numCastles = castlePoints.length;
  return <>
    <Typography className={classes.spacing}><b>The <a className={classes.link} href="https://fivethirtyeight.com/features/can-you-rule-riddler-nation/" target="_blank" rel="noopener noreferrer">castles puzzle</a>:</b></Typography>
    <Typography gutterBottom>{`In a distant, war-torn land, there are ${numCastles} castles. There are two warlords: you and your archenemy.`}</Typography>
    <Typography gutterBottom>{`Each castle has its own strategic value for a would-be conqueror. Specifically, the castles are worth ${formattedCastlePoints(castlePoints)} victory points.`}</Typography>
    <Typography gutterBottom>{`You and your enemy each have ${numSoldiers} soldier${numSoldiers === 1 ? '' : 's'} to distribute, any way you like, to fight at any of the ${numCastles} castles. Whoever sends more soldiers to a given castle conquers that castle and wins its victory points. If you each send the same number of troops, no points are rewarded.`}</Typography>
    <Typography gutterBottom>You don’t know what distribution of forces your enemy has chosen until the battles begin.</Typography>
    <Typography gutterBottom>Whoever wins the most points wins the war.</Typography>
    <Typography gutterBottom>{`Submit a plan distributing your ${numSoldiers} soldier${numSoldiers === 1 ? '' : 's'} among the ${numCastles} castles. One-on-one matchups will be played between all submitted strategies. Whoever wins the most wars wins the battle royale!`}</Typography>
    <Divider className={classes.spacing} />
    <Typography className={classes.spacing}><b>Genetic algorithm simulation:</b></Typography>
    <Typography gutterBottom>{`The above battle royale will be played out amongst ${populationSize} bots.`}</Typography>
    <Typography gutterBottom>Selection, crossover, and mutation will be applied accordingly using the number of wars won as a fitness function.</Typography>
    <Typography>Visualizations will track how the population evolves over time.</Typography>
  </>;
}