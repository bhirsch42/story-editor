import React from 'react';
import { arc } from 'd3-shape';
import {
  SECTION_INNER_RADIUS,
  SECTION_OUTER_RADIUS,
  PAD_ANGLE,
  CORNER_RADIUS
} from '../Wheel';

function CircleArc({startAngle, endAngle}) {
  let base = arc()
    .innerRadius(SECTION_INNER_RADIUS)
    .outerRadius(SECTION_OUTER_RADIUS)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .padAngle(PAD_ANGLE)
    .cornerRadius(CORNER_RADIUS);

  return <path d={base()}/>
}

function Circle({ sections, sectionAngles }) {
  return (
    <g>
      {sectionAngles.map(sectionAngle => <CircleArc {...sectionAngle}/>)}
    </g>
  );
}

export default Circle;
