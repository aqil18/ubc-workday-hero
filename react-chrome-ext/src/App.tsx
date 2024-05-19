import React from 'react';
import './App.css';

function getCourseString(url : string) : string {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    const dept = params.get('dept');
    const course = params.get('course');

    return `${dept}/${course}`
}


function App() {
    const handleClick = () => {
        window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            const currentTab = tabs[0];
            const courseString = getCourseString(currentTab.url);
            console.log(courseString);
            //const courseJson
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
