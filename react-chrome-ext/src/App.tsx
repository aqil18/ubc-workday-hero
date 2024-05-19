/* global chrome */
import React from 'react';
import './App.css';
function App() {

    const handleClick = () => {
        window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            const currentTab = tabs[0];
            alert(`Current URL: ${currentTab.url}`);
        });
    };

    return (
      <div className="App">
          <button type="button" onClick={handleClick}>Get Current URL</button>
      </div>
    );
}

export default App;
