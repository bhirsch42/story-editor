import React, { useRef } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { mapValues } from 'lodash';
import isSceneDragging from './isSceneDragging';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';


function Scene(props) {
  let {
    scene,
    x,
    y,
    lineX,
    lineY,
    width,
    isEditing,
    wasEditing,
    handleDoneEditingScene,
    deleteScene,
    updateScene,
    childRef,
    sceneEventHandlers,
  } = props;

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
    // scene.body = e.target.value;
    // setScene(scene);
    updateScene({...scene, body: e.target.value});
  }

  let handleSubmitScene = e => {
    e.preventDefault();
    handleDoneEditingScene(scene, e);
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
            <div className="d-flex">
              <button type="button" className="btn btn-danger btn-circle mr-1" onClick={() => deleteScene(scene)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button type="submit" className="btn btn-success btn-circle mr-1">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
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
