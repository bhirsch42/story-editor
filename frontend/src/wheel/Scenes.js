import React, { useRef, useLayoutEffect, useState } from 'react';
import positionSceneEls from './positionSceneEls';
import getSceneAttrs from './getSceneAttrs';
import Scene from './Scene';

function Scenes(props) {
  let sceneAttrs = getSceneAttrs(props);
  const targetRef = useRef();

  useLayoutEffect(() => positionSceneEls([...targetRef.current.getElementsByClassName('wheel__scene')]));

  return (
    <div className="wheel__scenes" ref={targetRef}>
      {sceneAttrs.map(scene => {
        return (
          <Scene {...scene}
                 onClick={() => props.onClickScene(scene)}
                 isEditing={props.currentlyEditingId === scene.id}
                 wasEditing={props.previouslyEditingId === scene.id}/>
        );
      })}
    </div>
  );
}

export default Scenes;
