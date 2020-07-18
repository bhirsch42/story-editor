import React, { useState } from 'react';
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

function Wheel({ sections: _sections }) {
  let width = 1000;
  let height = 600;

  let [sections, setSections] = useState(_sections);

  let endAngle = 0;
  let sectionAngles = sections.map(({ size, id }) => {
    let startAngle = endAngle;
    endAngle = startAngle + size * Math.PI * 2;
    return { startAngle, endAngle, key: id };
  });

  let transformCenter = {transform: `translateX(${width / 2}px) translateY(${height / 2}px)`};

  let scenes = flatten(sections.map(({ scenes }) => scenes));

  let [currentlyEditingId, setCurrentlyEditingId] = useState(null);
  let [previouslyEditingId, setPreviouslyEditingId] = useState(null);

  let editScene = scene => {
    setPreviouslyEditingId(currentlyEditingId);
    setCurrentlyEditingId(scene && scene.id || null);
  }

  let deleteScene = scene => {
    console.log('deleteScene', scene);
    sections.forEach(section => {
      let i = section.scenes.indexOf(scene);
      if (i > -1) {
        console.log("splice!", i)
        section.scenes.splice(i, 1);
        editScene(null);
      }
    });
  }

  return (
    <div className="wheel">
      <div className="wheel__foreground" style={transformCenter}>
        <Scenes sections={sections}
                sectionAngles={sectionAngles}
                width={width}
                previouslyEditingId={previouslyEditingId}
                currentlyEditingId={currentlyEditingId}
                editScene={editScene}
                deleteScene={deleteScene}/>
      </div>
      <svg width={width} height={height} style={{border: '1px solid green'}}>
        <g style={transformCenter}>
          <Circle sections={sections} sectionAngles={sectionAngles}/>
          <g className="wheel__scene-lines">
            {scenes.map(scene => <SceneLine scene={scene}
                                            key={scene.id}
                                            isEditing={scene.id === currentlyEditingId}
                                            wasEditing={scene.id === previouslyEditingId}/>)}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default Wheel;
