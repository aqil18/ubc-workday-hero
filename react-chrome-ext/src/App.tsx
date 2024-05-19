import React from 'react';
import './App.css';
function App() {

    const handleClick = () => {
        console.log("HSDSJNFSDF")
    };

    return (
      <div className="App">
          <button type="button" onClick={handleClick}>Click Me</button>
      </div>
    );
}

export default App;
