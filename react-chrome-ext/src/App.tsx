import React from 'react';
import './App.css';

const UBCGRADES: string  = 'https://ubcgrades.com/api/v3/course-statistics/UBCV/'






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

async function getPageText() {
    const [tab] = await window.chrome.tabs.query({active: true, currentWindow: true});
    let result;
    try {
        [{result}] = await window.chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => document.documentElement.innerText,
        });
        return result;
    } catch (e) {
        document.body.textContent = 'Cannot access page';
        return;
    }
}

function getProfString(pageText : string) : string {
    const rawProfString = pageText.match(/Instructor Teaching\n(.+?)\n/);

    if (rawProfString) {
        const instructorName = rawProfString[1].trim();
        console.log(instructorName);
        return instructorName;
    } else {
        console.log("Prof not found");
        return " Prof Not Found";
    }
}

function getCourseString(pageText : string) : string {
    
    const rawCourseStringArr = pageText.match(/\b[A-Z]{2,4}_V\s*\d{3}\b/g);
    if (rawCourseStringArr) {
        const rawCourseString = rawCourseStringArr[0]
        const dept = rawCourseString.substring(0, 4);
        const course = rawCourseString.substring(7, 10);

        return `${dept}/${course}`;
    } else {
        console.log("Course not found");
        return "Course Not Found";

    }
}

function processCourseString(courseString:string) {
    const courseJson = JSON.parse(getCourseJson(courseString));
    alert("Course Average for " + courseString + ": " + courseJson.average)
};

function App() {
    const  handleClick = async () => {
        const  pageText  = await getPageText();

        const profString = getProfString(pageText)
        const courseString = getCourseString(pageText)

        processCourseString(courseString);
        
    };

    return (
      <div className="App">
          <button type="button" onClick={handleClick}>Get Course Grades</button>
      </div>
    );
}

export default App;
