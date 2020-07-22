import React, { useState, useRef } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

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
    editScene,
    deleteScene,
    childRef,
    dragEvents,
  } = props;

  let [scene, setScene] = useState(_scene);

  let isDragging = scene.dragging && scene.dragging.down.x !== scene.dragging.move.x

  let isEditingClass = isEditing ? 'wheel__scene--is-editing' : '';
  let wasEditingClass = wasEditing ? 'wheel__scene--was-editing' : '';
  let isDraggingClass = isDragging ? 'wheel__scene--is-dragging' : '';

  let textAreaRef = useRef();

  let handleChangeSceneBody = e => {
    setScene({...scene, body: e.target.value});
  }

  let handleSubmitScene = e => {
    e.preventDefault();
    editScene(null);
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

  let _dragEvents = {
    onMouseDown(e) {
      let el = e.target.closest('.wheel__scene');

      scene.dragging = {
        origin: {
          x: Number(el.dataset.translateX),
          y: Number(el.dataset.translateY),
        },
        down: {
          x: e.clientX,
          y: e.clientY,
        },
        move: {
          x: e.clientX,
          y: e.clientY
        },
      };

      dragEvents.onMouseDown(scene, e);
    },

    onMouseMove(e) {

    },

    onMouseUp(e) {
      scene.dragging = null;

      if (isDragging) {
        dragEvents.onMouseUp(scene, e);
      } else {
        editScene(scene)
      }
    },
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
      {..._dragEvents}
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
