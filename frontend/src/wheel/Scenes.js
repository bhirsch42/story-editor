import React, { useRef, useEffect, useState } from 'react';
import positionSceneEls from './positionSceneEls';
import getSceneAttrs from './getSceneAttrs';

import {
  SECTION_INNER_RADIUS,
  SECTION_OUTER_RADIUS,
  PAD_ANGLE,
  SCENE_LINE_LENGTH,
  SCENE_LINE_PADDING,
  SCENE_PADDING
} from '../Wheel';

import Scene from './Scene';

function Scenes(props) {
  let sceneAttrs = getSceneAttrs(props);
  const targetRef = useRef();
  useEffect(() => positionSceneEls([...targetRef.current.getElementsByClassName('wheel__scene')]));
  let [currentlyEditingId, setCurrentlyEditingId] = useState(null);
  return (
    <div className="wheel__scenes" ref={targetRef}>
      {sceneAttrs.map(scene => {
        return (
          <Scene {...scene}
                 onClick={() => setCurrentlyEditingId(scene.id)}
                 isEditing={currentlyEditingId == scene.id}/>
        );
      })}
    </div>
  );
}

export default Scenes;
