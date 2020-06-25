import React from 'react';
import { Grid } from '@vx/grid';
import { scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';

import { Scoring } from '../App';
import { GenerationResult } from './GenerationResult';

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 100;

const MARGIN_TOP = 10;
const MARGIN_BOTTOM = 10;
const MARGIN_LEFT = 10;

type ScoreHistogramProps = {
  result: GenerationResult
}

export function ScoreHistogram({ result }: ScoreHistogramProps) {
  const xMax = VIEWBOX_WIDTH - MARGIN_LEFT;
  const yMax = VIEWBOX_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

  const xScale = scaleLinear({
    range: [0, xMax],
    domain: [0, 500]
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, 500]
  });
  return <svg width="100%" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
    <Grid
      top={MARGIN_TOP}
      left={MARGIN_LEFT}
      xScale={xScale}
      yScale={yScale}
      stroke="rgb(224, 224, 224)"
      width={xMax}
      height={yMax}
      numTicksRows={2}
      numTicksColumns={7}
    />
  </svg>;
}