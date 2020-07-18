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
  } = props;

  let sceneBody;

  let isEditingClass = isEditing ? 'wheel__scene--is-editing' : '';
  let wasEditingClass = wasEditing ? 'wheel__scene--was-editing' : '';

  let [scene, setScene] = useState(_scene);

  let textAreaRef = useRef();

  let handleChangeSceneBody = e => {
    setScene({...scene, body: e.target.value});
  }

  let handleSubmitScene = e => {
    e.preventDefault();
    editScene(null);
  }

  let onEnterPress = e => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      handleSubmitScene(e);
    }
  }

  let handleFocusTextarea = e => {
    let el = e.target;
    el.setSelectionRange(el.value.length,el.value.length);
  }

  return (
    <div className={`wheel__scene ${isEditingClass} ${wasEditingClass}`}
         data-x={x}
         data-y={y}
         data-line-x={lineX}
         data-line-y={lineY}
         style={{ maxWidth: `${width}px` }}
         id={`wheel-scene-${scene.id}`}
         onClick={() => editScene(scene)}>
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
