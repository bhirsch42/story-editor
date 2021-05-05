import React, { useState } from 'react';
import './App.scss';
import Wheel from './Wheel';
import wheelTemplateBasic from './fixtures/wheelTemplateBasic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

function App() {
  let getBlankWheel = () => {
    return JSON.parse(JSON.stringify(wheelTemplateBasic));
  };

  let savedWheelString = localStorage.getItem('wheel');
  let savedWheel = savedWheelString ? JSON.parse(savedWheelString) : getBlankWheel();

  let [wheel, setWheel] = useState(savedWheel);

  let saveWheel = updatedWheel => {
    localStorage.setItem('wheel', JSON.stringify(updatedWheel));
    setWheel(updatedWheel);
  }

  let handleTitleChange = e => {
    saveWheel({
      ...wheel,
      title: e.target.value,
    });
  }

  let newWheel = () => {
    saveWheel(getBlankWheel());
  }

  let handleWheelChange = saveWheel;

  return (
    <div className="App">
      <header>
        <input
          className="input--title mr-auto"
          type="text"
          value={wheel.title}
          onChange={handleTitleChange}
        />

        <button
          type="button"
          className="btn btn-danger btn-circle mr-1"
          onClick={() => newWheel()}
          data-tip="New Wheel"
        >
          <FontAwesomeIcon icon={faFile} />
        </button>
      </header>
      <Wheel
        wheelData={wheel}
        onChange={handleWheelChange}
      />
    </div>
  );
}

export default App;
