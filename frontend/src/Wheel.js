import React, { useState, useRef } from 'react';
import { flatten, findIndex } from 'lodash';
import Scenes from './wheel/Scenes';
import Circle from './wheel/Circle';
import SceneLine from './wheel/SceneLine';
import getSceneAttrs from './wheel/getSceneAttrs';

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
  let svgEl = useRef();

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
  let [draggingScene, setDraggingScene] = useState(null);

  let editScene = scene => {
    setPreviouslyEditingId(currentlyEditingId);
    let sceneId = scene && scene.id;
    setCurrentlyEditingId(sceneId || null);
  }

  let deleteScene = scene => {
    sections.forEach(section => {
      let i = findIndex(section.scenes, s => s.id === scene.id);
      if (i > -1) {
        section.scenes.splice(i, 1);
        editScene(null);
      }
    });
  }

  let dragEvents = {
    onMouseDown(scene, e) {
      setDraggingScene(scene);
    },

    onMouseUp(scene, e) {
      setSections([...sections]);
    },
  }

  let angleTo = (x, y) => {
    let { x: elX, y: elY } = svgEl.current.getClientRects()[0];
    let angle = Math.atan2(y - height / 2 - elY, x - width / 2 - elX) + Math.PI / 2;
    return angle < 0 ? 2 * Math.PI + angle : angle;
  }

  let scenesProps = {
    sections: sections,
    sectionAngles: sectionAngles,
    width: width,
    previouslyEditingId: previouslyEditingId,
    currentlyEditingId: currentlyEditingId,
    editScene: editScene,
    deleteScene: deleteScene,
    dragEvents: dragEvents,
  }

  let sceneAttrs = getSceneAttrs(scenesProps);

  let onMouseMove = (e) => {
    if (!draggingScene || !draggingScene.dragging) return;

    let [ x, y ] = [ e.clientX, e.clientY ];

    let angle = angleTo(x, y);

    let sectionAngle = sectionAngles.find(sectionAngle =>
      sectionAngle.startAngle <= angle && angle <= sectionAngle.endAngle);

    let sectionIndex = sectionAngles.indexOf(sectionAngle);

    draggingScene.dragging.move = { x, y };

    sections.forEach(section => {
      let i = findIndex(section.scenes, s => s.id === draggingScene.id);
      if (i > -1) section.scenes.splice(i, 1);
    });

    let insertIndex = findIndex(sections[sectionIndex].scenes, s => {
      let { x, y } = sceneAttrs.find(sA => sA.id === s.id);
      let sceneAngle = Math.atan2(y, x) + Math.PI / 2;
      sceneAngle = sceneAngle < 0 ? 2 * Math.PI + sceneAngle : sceneAngle;
      return angle < sceneAngle;
    });

    if (insertIndex === -1) {
      sections[sectionIndex].scenes.push(draggingScene);
    } else {
      sections[sectionIndex].scenes.splice(insertIndex, 0, draggingScene);
    }

    setSections([...sections]);
  }

  return (
    <div className="wheel" onMouseMove={onMouseMove}>
      <div className="wheel__foreground" style={transformCenter}>
        <Scenes {...scenesProps} sceneAttrs={sceneAttrs}/>
      </div>
      <svg ref={svgEl} width={width} height={height} style={{border: '1px solid green'}}>
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
