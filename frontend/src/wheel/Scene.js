import React, { useState, useRef } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { mapValues } from 'lodash';
import isSceneDragging from './isSceneDragging'

function Scene(props) {
  let {
    scene: _scene,
    x,
    y,
    lineX,
    lineY,
    width,
    isEditing,
    wasEditing,
    handleDoneEditingScene,
    deleteScene,
    childRef,
    sceneEventHandlers,
  } = props;

  let [scene, setScene] = useState(_scene);

  let sceneEventHandlerClosures = mapValues(sceneEventHandlers, sceneEventHandler => {
    return (...args) => {
      sceneEventHandler(scene, ...args);
    };
  });

  let isDragging = isSceneDragging(scene);

  let isEditingClass = isEditing ? 'wheel__scene--is-editing' : '';
  let wasEditingClass = wasEditing ? 'wheel__scene--was-editing' : '';
  let isDraggingClass = isDragging ? 'wheel__scene--is-dragging' : '';

  let textAreaRef = useRef();

  let handleChangeSceneBody = e => {
    setScene({...scene, body: e.target.value});
  }

  let handleSubmitScene = e => {
    e.preventDefault();
    handleDoneEditingScene(e);
  }

  let onEnterPress = e => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      handleSubmitScene(e);
    }
  }

  let handleFocusTextarea = e => {
    let el = e.target;
    el.setSelectionRange(el.value.length, el.value.length);
  }

  return (
    <div
      ref={childRef}
      className={`wheel__scene ${isEditingClass} ${wasEditingClass} ${isDraggingClass}`}
      data-x={x}
      data-y={y}
      data-line-x={lineX}
      data-line-y={lineY}
      style={{ maxWidth: `${width}px` }}
      id={`wheel-scene-${scene.id}`}
      {...sceneEventHandlerClosures}
    >
      {isEditing ? (
        <form className="wheel__scene__editor" onSubmit={handleSubmitScene}>
          <TextareaAutosize
            autoFocus
            ref={textAreaRef}
            value={scene.body}
            onChange={handleChangeSceneBody}
            onFocus={handleFocusTextarea}
            onKeyDown={onEnterPress}
          />
          <div className="actions">
            <button type="button" onClick={() => deleteScene(scene)}>Delete</button>
            <button type="submit">Done</button>
          </div>
        </form>
      ) : (
        <div className="wheel__scene__body">
          {scene.body}
        </div>
      )}
    </div>
  )
}

export default Scene
