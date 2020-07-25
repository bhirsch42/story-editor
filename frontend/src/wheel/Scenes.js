import React, { useRef, useLayoutEffect, createRef } from 'react';
import positionSceneEls from './positionSceneEls';
import Scene from './Scene';

function Scenes(props) {
  let {
    sceneAttrs,
    handleDoneEditingScene,
    deleteScene,
    currentlyEditingId,
    previouslyEditingId,
    sceneEventHandlers,
  } = props;

  const targetRef = useRef();

  let scenes = sceneAttrs.map((sceneData, i) => {
    let ref = createRef();

    return {
      ref,
      scene: sceneData.scene,
      node: (
        <Scene
          {...sceneData}
          childRef={ref}
          handleDoneEditingScene={handleDoneEditingScene}
          deleteScene={deleteScene}
          isEditing={currentlyEditingId === sceneData.id}
          wasEditing={previouslyEditingId === sceneData.id}
          sceneEventHandlers={sceneEventHandlers}
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
