import React, { useRef, useLayoutEffect } from 'react';

function SceneLine({ scene, isEditing, wasEditing }) {
  let lineRef = useRef();
  let xRef = useRef();
  let yRef = useRef();

  useLayoutEffect(() => {
    let xAnimEl = xRef.current;
    let yAnimEl = yRef.current;
    let sceneEl = document.getElementById(`wheel-scene-${scene.id}`);

    let x1 = Number(sceneEl.dataset.lineX);
    let y1 = Number(sceneEl.dataset.lineY);
    let translateX = Number(sceneEl.dataset.translateX);
    let translateY = Number(sceneEl.dataset.translateY);

    let { width, height } = sceneEl.getBoundingClientRect();
    let x2 = translateX + (x1 < 0 ? width : 0);
    let y2 = translateY + (y1 <= 0 ? height : 0);

    lineRef.current.setAttribute('x1', x1);
    lineRef.current.setAttribute('y1', y1);
    lineRef.current.setAttribute('x2', x2);
    lineRef.current.setAttribute('y2', y2);

    xAnimEl.setAttribute('from', xAnimEl.getAttribute('to') || x1);
    xAnimEl.setAttribute('to', x2);
    yAnimEl.setAttribute('from', yAnimEl.getAttribute('to') || y1);
    yAnimEl.setAttribute('to', y2);

    if (!(isEditing || wasEditing)) {
      xAnimEl.beginElement();
      yAnimEl.beginElement();
    }
  });

  return (
    <g>
      <line ref={lineRef} id={`scene-line-${scene.id}`}/>
      <animate ref={xRef}
               xlinkHref={`#scene-line-${scene.id}`}
               attributeName="x2"
               begin="indefinite"
               dur="0.25s"/>
      <animate ref={yRef}
               xlinkHref={`#scene-line-${scene.id}`}
               attributeName="y2"
               begin="indefinite"
               dur="0.25s"/>
    </g>
  )
}

export default SceneLine;
