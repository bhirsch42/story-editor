import React from 'react';
import './App.css';
import Wheel from './Wheel';
import wheelData from './fixtures/sections';

function App() {
  return (
    <div className="App">
      <h1>My cool app</h1>
      <Wheel sections={wheelData} width={1200} height={800}/>
    </div>
  );
}

export default App;
