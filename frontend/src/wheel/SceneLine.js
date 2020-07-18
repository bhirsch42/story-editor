import React, { useRef, useEffect } from 'react';

function SceneLine({ scene }) {
  let targetRef = useRef();

  useEffect(() => {
    let lineEl = targetRef.current;
    let sceneEl = document.getElementById(`wheel-scene-${scene.id}`);

    let lineX = Number(sceneEl.dataset.lineX)
    let lineY = Number(sceneEl.dataset.lineY)
    let translateX = Number(sceneEl.dataset.translateX)
    let translateY = Number(sceneEl.dataset.translateY)

    let { width, height } = sceneEl.getBoundingClientRect();
    lineEl.setAttribute('x1', lineX);
    lineEl.setAttribute('y1', lineY);
    lineEl.setAttribute('x2', translateX + (lineX < 0 ? width : 0));
    lineEl.setAttribute('y2', translateY + (lineY < 0 ? height : 0));
  });

  return <line ref={targetRef}/>
}

export default SceneLine;
