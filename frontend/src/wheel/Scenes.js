import React, { useRef, useEffect } from 'react';
import { arc } from 'd3-shape';
import { flatten } from 'lodash';
import {
  SECTION_INNER_RADIUS,
  SECTION_OUTER_RADIUS,
  PAD_ANGLE,
  SCENE_LINE_LENGTH,
  SCENE_LINE_PADDING,
  SCENE_PADDING
} from '../Wheel';

function positionSceneEls(sceneEls) {
  let sceneBuckets = {
    top: {
      right: [],
      left: [],
    },
    bottom: {
      right: [],
      left: [],
    },
  }

  sceneEls.forEach(sceneEl => {
    let x = Number(sceneEl.dataset.x);
    let y = Number(sceneEl.dataset.y);
    let { width, height } = sceneEl.getBoundingClientRect();
    let semiY = y > 0 ? 'bottom' : 'top';
    let semiX = x > 0 ? 'right' : 'left';

    sceneBuckets[semiY][semiX].push({
      el: sceneEl,
      x, y, width, height
    });
  });

  let prevBound;

  let applyTransform = (el, x, y) => {
    el.style.transform = `translateX(${x}px) translateY(${y}px)`;
    el.dataset['translateX'] = x;
    el.dataset['translateY'] = y;
  }

  prevBound = 0;
  sceneBuckets.top.right.reverse().forEach(scene => {
    let x = scene.x
    let y = Math.min(scene.y - scene.height, prevBound - scene.height - SCENE_PADDING);
    applyTransform(scene.el, x, y);
    prevBound = y;
  });

  prevBound = 0;
  sceneBuckets.top.left.forEach(scene => {
    let x = scene.x - scene.width
    let y = Math.min(scene.y - scene.height, prevBound - scene.height - SCENE_PADDING);
    applyTransform(scene.el, x, y);
    scene.el.style['text-align'] = 'right';
    prevBound = y;
  });

  prevBound = 0;
  sceneBuckets.bottom.right.forEach(scene => {
    let x = scene.x;
    let y = Math.max(scene.y, prevBound);
    applyTransform(scene.el, x, y);
    prevBound = y + scene.height + SCENE_PADDING;
  });

  prevBound = 0;
  sceneBuckets.bottom.left.reverse().forEach(scene => {
    let x = scene.x - scene.width
    let y = Math.max(scene.y, prevBound);
    applyTransform(scene.el, x, y);
    scene.el.style['text-align'] = 'right';
    prevBound = y + scene.height + SCENE_PADDING;
  });
}

function Scene({ body, x, y, lineX, lineY, width, id }) {
  return (
    <div className="wheel__scene"
         data-x={x}
         data-y={y}
         data-line-x={lineX}
         data-line-y={lineY}
         style={{ maxWidth: `${width}px` }}
         id={`wheel-scene-${id}`}>
      <div className="wheel__scene__body">
        {body}
      </div>
    </div>
  )
}

function Scenes({ sections, sectionAngles, width }) {
  let scenesBySection = sections.map((section, i) => {
    let { startAngle, endAngle } = sectionAngles[i];
    let scenes = section.scenes;
    let sectionLength = (endAngle - startAngle - PAD_ANGLE * 2) / scenes.length;

    return scenes.map((scene, j) => {
      let baseArc = arc()
        .startAngle(startAngle + j * sectionLength + PAD_ANGLE)
        .endAngle(startAngle + (j + 1) * sectionLength + PAD_ANGLE);

      let [x, y] = baseArc
        .innerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_LINE_PADDING)
        .outerRadius(SECTION_OUTER_RADIUS + SCENE_LINE_LENGTH + SCENE_LINE_PADDING)
        .centroid();

      let [lineX, lineY] = baseArc
        .innerRadius(SECTION_INNER_RADIUS)
        .outerRadius(SECTION_INNER_RADIUS)
        .centroid();

      let sceneAttrs = {
        body: scene.body,
        x, y, lineX, lineY,
        width: width / 2 - Math.abs(x) - SCENE_PADDING * 2,
        key: scene.id,
        id: scene.id,
      }

      return (
        <Scene {...sceneAttrs}/>
      );
    })
  });

  const targetRef = useRef();

  useEffect(() => positionSceneEls([...targetRef.current.getElementsByClassName('wheel__scene')]));

  return (
    <div className="wheel__scenes" ref={targetRef}>
      {flatten(scenesBySection)}
    </div>
  );
}

export default Scenes;
