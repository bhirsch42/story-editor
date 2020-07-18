import React from 'react';

function Scene({ body, x, y, lineX, lineY, width, id, onClickScene, isEditing, wasEditing, onClick }) {
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

  let isEditingClass = isEditing ? 'wheel__scene--is-editing' : '';
  let wasEditingClass = wasEditing ? 'wheel__scene--was-editing' : '';

  return (
    <div className={`wheel__scene ${isEditingClass} ${wasEditingClass}`}
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
