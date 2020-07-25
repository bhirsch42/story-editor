import React, { useState, useRef } from 'react';
import { flatten, findIndex } from 'lodash';
import Scenes from './wheel/Scenes';
import Circle from './wheel/Circle';
import SceneLine from './wheel/SceneLine';
import getSceneAttrs from './wheel/getSceneAttrs';
import getSectionAngles from './wheel/getSectionAngles';
import angleTo from './lib/angleTo';
import isSceneDragging from './wheel/isSceneDragging'

export const SECTION_INNER_RADIUS = 150;
export const SECTION_OUTER_RADIUS = 160;
export const PAD_ANGLE = Math.PI / 90;
export const CORNER_RADIUS = 3;
export const SCENE_LINE_LENGTH = 10
export const SCENE_LINE_PADDING = 5;
export const SCENE_PADDING = 10;

let ids = (function * () {
  let id = 1000;
  while(true) yield id++;
})();

function Wheel({ sections: _sections }) {
  let width = 1000;
  let height = 600;

  let svgEl = useRef();

  let [sections, setSections] = useState(_sections);
  let [currentlyEditingId, setCurrentlyEditingId] = useState(null);
  let [previouslyEditingId, setPreviouslyEditingId] = useState(null);
  let [mouseDownScene, setMouseDownScene] = useState(null);
  let [newScene, setNewScene] = useState(null);

  let sectionAngles = getSectionAngles(sections);
  let scenes = flatten(sections.map(({ scenes }) => scenes));
  let sceneAttrs = getSceneAttrs({sections, sectionAngles, width});

  let reRender = () => setSections([...sections]);

  let editScene = scene => {
    setPreviouslyEditingId(currentlyEditingId);
    let sceneId = scene && scene.id;
    setCurrentlyEditingId(sceneId || null);
  };

  let handleDoneEditingScene = _scene => {
    editScene(null);
  };

  let removeScene = scene => {
    sections.forEach(section => {
      let i = findIndex(section.scenes, s => s.id === scene.id);
      if (i > -1) section.scenes.splice(i, 1);
    });
  };

  let insertSceneAt = (scene, x, y) => {
    let angle = angleTo(x, y, svgEl);

    let sectionAngle = sectionAngles.find(sectionAngle =>
      sectionAngle.startAngle <= angle && angle <= sectionAngle.endAngle);

    let sectionIndex = sectionAngles.indexOf(sectionAngle);

    let insertIndex = findIndex(sections[sectionIndex].scenes, s => {
      let { x, y } = sceneAttrs.find(sA => sA.id === s.id);
      let sceneAngle = angleTo(x, y);
      return angle < sceneAngle;
    });

    if (insertIndex === -1) {
      sections[sectionIndex].scenes.push(scene);
    } else {
      sections[sectionIndex].scenes.splice(insertIndex, 0, scene);
    }
  }

  let sceneEventHandlers = {
    onMouseDown(scene, e) {
      let el = e.target.closest('.wheel__scene');

      scene.dragging = {
        origin: {
          x: Number(el.dataset.translateX),
          y: Number(el.dataset.translateY),
        },
        down: {
          x: e.clientX,
          y: e.clientY,
        },
        move: {
          x: e.clientX,
          y: e.clientY,
        },
      };

      setMouseDownScene(scene);
    },
  };

  let containerEventHandlers = {
    onMouseDown(e) {
      if (e.target != svgEl.current) return;

      setNewScene({
        id: ids.next().value,
        body: "New scene...",
      });
    },

    onMouseUp(e) {
      if (newScene) {
        insertSceneAt(newScene, e.clientX, e.clientY);
        editScene(newScene);
        setNewScene(null);
        return;
      }

      if (!mouseDownScene) return;

      let isDragging = isSceneDragging(mouseDownScene);

      mouseDownScene.dragging = null;

      if (isDragging) {
        reRender();
      } else {
        editScene(mouseDownScene);
      }

      setMouseDownScene(null);
    },

    onMouseMove(e) {
      if (!mouseDownScene || !mouseDownScene.dragging) return;

      let [ x, y ] = [ e.clientX, e.clientY ];

      mouseDownScene.dragging.move = { x, y };

      removeScene(mouseDownScene);
      insertSceneAt(mouseDownScene, x, y);

      reRender();
    },
  };

  let transformCenter = {transform: `translateX(${width / 2}px) translateY(${height / 2}px)`};

  let deleteScene = scene => {
    removeScene(scene);
    handleDoneEditingScene(scene);
  };

  return (
    <div className="wheel" {...containerEventHandlers}>
      <div className="wheel__foreground" style={transformCenter}>
        <Scenes
          previouslyEditingId={previouslyEditingId}
          currentlyEditingId={currentlyEditingId}
          handleDoneEditingScene={handleDoneEditingScene}
          deleteScene={deleteScene}
          sceneAttrs={sceneAttrs}
          sceneEventHandlers={sceneEventHandlers}
        />
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
