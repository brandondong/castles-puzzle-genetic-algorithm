import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { Scoring } from '../App';
import { GenerationResult } from './GenerationResult';

const data = [
  {
    "country": "1",
    "hot dog": 85,
    "burger": 54,
    "sandwich": 76,
    "sandwichColor": "hsl(97, 70%, 50%)",
    "kebab": 197,
    "kebabColor": "hsl(14, 70%, 50%)",
    "fries": 47,
    "friesColor": "hsl(230, 70%, 50%)",
    "donut": 84,
    "donutColor": "hsl(228, 70%, 50%)"
  },
  {
    "country": "2",
    "hot dog": 188,
    "hot dogColor": "hsl(143, 70%, 50%)",
    "burger": 50,
    "burgerColor": "hsl(238, 70%, 50%)",
    "sandwich": 73,
    "sandwichColor": "hsl(14, 70%, 50%)",
    "kebab": 3,
    "kebabColor": "hsl(226, 70%, 50%)",
    "fries": 20,
    "friesColor": "hsl(263, 70%, 50%)",
    "donut": 183,
    "donutColor": "hsl(294, 70%, 50%)"
  },
  {
    "country": "3",
    "hot dog": 68,
    "hot dogColor": "hsl(342, 70%, 50%)",
    "burger": 60,
    "burgerColor": "hsl(287, 70%, 50%)",
    "sandwich": 19,
    "sandwichColor": "hsl(73, 70%, 50%)",
    "kebab": 112,
    "kebabColor": "hsl(45, 70%, 50%)",
    "fries": 90,
    "friesColor": "hsl(191, 70%, 50%)",
    "donut": 17,
    "donutColor": "hsl(179, 70%, 50%)"
  },
  {
    "country": "4",
    "hot dog": 42,
    "hot dogColor": "hsl(216, 70%, 50%)",
    "burger": 69,
    "burgerColor": "hsl(56, 70%, 50%)",
    "sandwich": 142,
    "sandwichColor": "hsl(118, 70%, 50%)",
    "kebab": 99,
    "kebabColor": "hsl(225, 70%, 50%)",
    "fries": 127,
    "friesColor": "hsl(137, 70%, 50%)",
    "donut": 118,
    "donutColor": "hsl(193, 70%, 50%)"
  },
  {
    "country": "5",
    "hot dog": 92,
    "hot dogColor": "hsl(53, 70%, 50%)",
    "burger": 127,
    "burgerColor": "hsl(259, 70%, 50%)",
    "sandwich": 14,
    "sandwichColor": "hsl(91, 70%, 50%)",
    "kebab": 25,
    "kebabColor": "hsl(114, 70%, 50%)",
    "fries": 26,
    "friesColor": "hsl(3, 70%, 50%)",
    "donut": 168,
    "donutColor": "hsl(258, 70%, 50%)"
  },
  {
    "country": "6",
    "hot dog": 110,
    "hot dogColor": "hsl(279, 70%, 50%)",
    "burger": 154,
    "burgerColor": "hsl(244, 70%, 50%)",
    "sandwich": 197,
    "sandwichColor": "hsl(231, 70%, 50%)",
    "kebab": 63,
    "kebabColor": "hsl(129, 70%, 50%)",
    "fries": 190,
    "friesColor": "hsl(290, 70%, 50%)",
    "donut": 194,
    "donutColor": "hsl(161, 70%, 50%)"
  },
  {
    "country": "7",
    "hot dog": 97,
    "hot dogColor": "hsl(304, 70%, 50%)",
    "burger": 164,
    "burgerColor": "hsl(244, 70%, 50%)",
    "sandwich": 166,
    "sandwichColor": "hsl(96, 70%, 50%)",
    "kebab": 102,
    "kebabColor": "hsl(211, 70%, 50%)",
    "fries": 158,
    "friesColor": "hsl(314, 70%, 50%)",
    "donut": 37,
    "donutColor": "hsl(156, 70%, 50%)"
  }
];

type ScoreHistogramProps = {
  result: GenerationResult
}

export function ScoreHistogram({ result }: ScoreHistogramProps) {
  return <ResponsiveBar
    data={data}
    keys={['hot dog', 'burger']}
    indexBy="country"
    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: result.scoring === Scoring.Wins ? 'Wars won' : 'Victory points achieved',
      legendPosition: 'middle',
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Frequency',
      legendPosition: 'middle',
      legendOffset: -40
    }}
    enableLabel={false}
    isInteractive={false}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />;
}