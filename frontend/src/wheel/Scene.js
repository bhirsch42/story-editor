import React, { useState } from 'react';

function Scene({ body, x, y, lineX, lineY, width, id, onClick, isEditing }) {
  let sceneBody;

  if (isEditing) {
    sceneBody = (
      <h1>editing!</h1>
    )
  } else {
    sceneBody = (
      <div className="wheel__scene__body">
        {body}
      </div>
    )
  }

  return (
    <div className="wheel__scene"
         data-x={x}
         data-y={y}
         data-line-x={lineX}
         data-line-y={lineY}
         style={{ maxWidth: `${width}px` }}
         id={`wheel-scene-${id}`}
         onClick={onClick}>
      { sceneBody }
    </div>
  )
}

export default Scene
