import React from 'react';
import './App.css';
import Wheel from './Wheel';
import wheelData from './fixtures/sections';

function App() {
  return (
    <div className="App">
      <h1>My cool app</h1>
      <Wheel sections={wheelData} width={1000} height={400}/>
    </div>
  );
}

export default App;