import React from 'react';
import './App.css';


const UBCGRADES: string  = 'https://ubcgrades.com/api/v3/course-statistics/UBCV/'
function getCourseString(url : string) : string {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    const dept = params.get('dept');
    const course = params.get('course');

    return `${dept}/${course}`
}


function getCourseJson(courseString : string) : any {
    fetch(UBCGRADES + courseString)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function App() {
    const handleClick = () => {
        window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            const currentTab = tabs[0];
            const courseString = getCourseString(currentTab.url);
            console.log(courseString);
            const courseJson : any = getCourseJson(courseString);
            alert(`Current URL: ${courseJson.average_past_5_yrs}`);
        });
    };

    return (
      <div className="App">
          <button type="button" onClick={handleClick}>Get Course Grades</button>
      </div>
    );
}

export default App;
