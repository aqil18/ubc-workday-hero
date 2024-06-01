import React from 'react';
import './App.css';

const UBCGRADES: string  = 'https://ubcgrades.com/api/v3/course-statistics/UBCV/'
// function getCourseString(url : string) : string {
//     const urlObj = new URL(url);
//     const params = new URLSearchParams(urlObj.search);
//
//     const dept = params.get('dept');
//     const course = params.get('course');
//
//     return `${dept}/${course}`
// }

function getCourseString(rawString : string) : string {
    const dept = rawString.substring(0, 4);
    const course = rawString.substring(7, 10);

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
    const  handleClick = async () => {
        const [tab] = await window.chrome.tabs.query({active: true, currentWindow: true});
        console.log(tab.id);
        let result;
        try {
            [{result}] = await window.chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: () => document.documentElement.innerText,
            });
        } catch (e) {
            document.body.textContent = 'Cannot access page';
            return;
        }
        console.log(result);
        var rawString = result.match(/\b[A-Z]{2,4}_V\s*\d{3}\b/g);

        // Regular expression to find the instructor's name
        const instructorPattern = /Instructor Teaching\n(.+?)\n/;

        // Find the match in the text
        const match = result.match(instructorPattern);

        if (match) {
            const instructorName = match[1].trim();
            console.log(instructorName);
        } else {
            console.log("Instructor not found");
        }
        console.log(rawString[0]);
        const courseString = getCourseString(rawString[0])
        console.log(courseString);
        const courseJson = JSON.parse(getCourseJson(courseString));
        alert("Course Average for " + rawString + ": " + courseJson.average);
    };

    return (
      <div className="App">
          <button type="button" onClick={handleClick}>Get Course Grades</button>
      </div>
    );
}

export default App;
