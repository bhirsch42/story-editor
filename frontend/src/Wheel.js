import React from 'react';
import { flatten } from 'lodash';
import Scenes from './wheel/Scenes';
import Circle from './wheel/Circle';
import SceneLine from './wheel/SceneLine';

export const SECTION_INNER_RADIUS = 90;
export const SECTION_OUTER_RADIUS = 100;
export const PAD_ANGLE = Math.PI / 90;
export const CORNER_RADIUS = 3;
export const SCENE_LINE_LENGTH = 10
export const SCENE_LINE_PADDING = 5;
export const SCENE_PADDING = 10;

class Wheel extends React.Component {
  render () {
    let { sections } = this.props;
    let width = 1000;
    let height = 600;


    let endAngle = 0;
    let sectionAngles = sections.map(({ size, id }) => {
      let startAngle = endAngle;
      endAngle = startAngle + size * Math.PI * 2;
      return { startAngle, endAngle, key: id };
    });

    let transformCenter = {transform: `translateX(${width / 2}px) translateY(${height / 2}px)`};

    let scenes = flatten(sections.map(({ scenes }) => scenes));

    return (
      <div className="wheel">
        <div className="wheel__foreground" style={transformCenter}>
          <Scenes sections={sections} sectionAngles={sectionAngles} width={width}/>
        </div>
        <svg width={width} height={height} style={{border: '1px solid green'}}>
          <g style={transformCenter}>
            <Circle sections={sections} sectionAngles={sectionAngles}/>
            <g className="wheel__scene-lines">
              {scenes.map(scene => <SceneLine scene={scene} key={scene.id}/>)}
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default Wheel;