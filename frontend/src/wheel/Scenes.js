import React, { useRef, useLayoutEffect, createRef } from 'react';
import positionSceneEls from './positionSceneEls';
import Scene from './Scene';

function Scenes(props) {
  let { sceneAttrs } = props;
  const targetRef = useRef();
  let sceneRefs = useRef(sceneAttrs.map(() => createRef()));

  let scenes = sceneAttrs.map((sceneData, i) => {
    let ref = sceneRefs.current[i];
    return {
      ref,
      scene: sceneData.scene,
      node: (
        <Scene
          {...sceneData}
          childRef={ref}
          editScene={props.editScene}
          deleteScene={props.deleteScene}
          isEditing={props.currentlyEditingId === sceneData.id}
          wasEditing={props.previouslyEditingId === sceneData.id}
          dragEvents={props.dragEvents}
        />
      ),
    }
  });

  useLayoutEffect(() => { positionSceneEls(scenes) });

  let sceneNodes = scenes.map(({ node }) => node);

  return (
    <div className="wheel__scenes" ref={targetRef}>
      {sceneNodes}
    </div>
  );
}

export default Scenes;
