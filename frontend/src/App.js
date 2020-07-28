import React from 'react';
import './App.scss';
import Wheel from './Wheel';
import wheelData from './fixtures/sections';

function App() {
  return (
    <div className="App">
      <Wheel sections={wheelData} width={1000} height={400}/>
    </div>
  );
}

export default App;
