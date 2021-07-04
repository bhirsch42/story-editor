import { findIndex, flatten, throttle } from 'lodash';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import angleTo from './lib/angleTo';
import Circle from './wheel/Circle';
import getCornerClosestToCenterCoords from './wheel/getCornerClosestToCenterCoords';
import getSceneAttrs from './wheel/getSceneAttrs';
import getSectionAngles from './wheel/getSectionAngles';
import isSceneDragging from './wheel/isSceneDragging';
import SceneLine from './wheel/SceneLine';
import Scenes from './wheel/Scenes';

export const SECTION_INNER_RADIUS = 150;
export const SECTION_OUTER_RADIUS = 160;
export const PAD_ANGLE = Math.PI / 90;
export const CORNER_RADIUS = 3;
export const SCENE_LINE_LENGTH = 10
export const SCENE_LINE_PADDING = 5;
export const SCENE_PADDING = 10;

function Wheel({ wheelData, onChange }) {
  let containerEl = useRef();
  let svgEl = useRef();
  let [width, setWidth] = useState(window.innerWidth);
  let [height, setHeight] = useState(window.innerHeight);

  let [sections, setSections] = useState(wheelData.sections);
  let [currentlyEditingId, setCurrentlyEditingId] = useState(null);
  let [previouslyEditingId, setPreviouslyEditingId] = useState(null);
  let [mouseDownScene, setMouseDownScene] = useState(null);
  let [newScene, setNewScene] = useState(null);

  let sectionAngles = getSectionAngles(sections);
  let scenes = flatten(sections.map(({ scenes }) => scenes));
  let sceneAttrs = getSceneAttrs({sections, sectionAngles, width});

  let ids = (function * () {
    let id = Math.max(0, ...scenes.map(scene => scene.id));
    while(true) yield ++id;
  })();

  useEffect(() => {
    setSections(wheelData.sections);
  }, [wheelData]);

  let reRender = () => setSections([...sections]);

  let _onChange = () => {
    onChange({
      ...wheelData,
      sections,
    });
  }

  let editScene = scene => {
    setPreviouslyEditingId(currentlyEditingId);
    let sceneId = scene && scene.id;
    setCurrentlyEditingId(sceneId || null);
    _onChange();
  };

  let updateScene = scene => {
    sections.forEach(section => {
      let i = findIndex(section.scenes, s => s.id === scene.id);
      if (i > -1) section.scenes.splice(i, 1, scene);
    });

    _onChange();
  }

  let handleDoneEditingScene = scene => {
    if (scene.body.length === 0) {
      removeScene(scene);
    }

    editScene(null);
  };

  let removeScene = scene => {
    sections.forEach(section => {
      let i = findIndex(section.scenes, s => s.id === scene.id);
      if (i > -1) section.scenes.splice(i, 1);
    });

    _onChange();
  };

  let insertSceneAt = (scene, x, y) => {
    let angle = angleTo(x, y, svgEl.current);

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
      let editingEl = e.target.closest('.wheel__scene--is-editing');
      if (editingEl) return;

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
      if (e.target !== svgEl.current) return;

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
        _onChange();
      } else {
        editScene(mouseDownScene);
      }

      setMouseDownScene(null);
    },

    onMouseMove(e) {
      if (!mouseDownScene || !mouseDownScene.dragging) return;

      let [ x, y ] = [ e.clientX, e.clientY ];
      mouseDownScene.dragging.move = { x, y };
      let coords = getCornerClosestToCenterCoords(e.target, svgEl.current, mouseDownScene);

      if (!coords) return;

      removeScene(mouseDownScene);
      insertSceneAt(mouseDownScene, ...coords);

      reRender();
    },
  };

  useLayoutEffect(() => {
    let handleResize = () => {
      let rect = containerEl.current.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    }

    handleResize();

    let throttledHandleResize = throttle(handleResize, 200);
    window.addEventListener('resize', throttledHandleResize);

    return () => {
      window.removeEventListener('resize', throttledHandleResize);
    }
  })

  let transformCenter = {transform: `translateX(${width / 2}px) translateY(${height / 2}px)`};

  let deleteScene = scene => {
    removeScene(scene);
    handleDoneEditingScene(scene);
  };

  return (
    <div className={"wheel" + (mouseDownScene ? ' --is-dragging' : '')} {...containerEventHandlers} ref={containerEl}>
      <div className="wheel__foreground" style={transformCenter}>
        <Scenes
          previouslyEditingId={previouslyEditingId}
          currentlyEditingId={currentlyEditingId}
          handleDoneEditingScene={handleDoneEditingScene}
          updateScene={updateScene}
          deleteScene={deleteScene}
          sceneAttrs={sceneAttrs}
          sceneEventHandlers={sceneEventHandlers}
        />
      </div>
      <svg className="wheel__svg" ref={svgEl} width={width} height={height}>
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
