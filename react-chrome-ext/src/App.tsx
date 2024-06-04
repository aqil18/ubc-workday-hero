import React from 'react';
import './App.css';

const UBCGRADES: string  = 'https://ubcgrades.com/api/v3/course-statistics/UBCV/'



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
async function getCourseJson(courseString: string): Promise<any> {
    try {
        const response = await fetch(UBCGRADES + courseString);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function processCourseString(courseString: string) {
    try {
        const courseJson = await getCourseJson(courseString);
        alert("Course Average for " + courseString + ": " + courseJson.average);
    } catch (error) {
        console.error('Error processing course string:', error);
    }
}
function processProfString(profString : string) {
    let firstName = profString.trim().split(" ")[0]
    let lastName = profString.trim().split(" ")[1]
    let html = "";
    let professorRating = 0.0;
    let professorID = 0;
    let numRatings = 0;
    let wouldTakeAgainPercent;
    let avgDifficulty;
    let url = "";
    
    if (profString.length > 1) {
  
        url = `https://www.ratemyprofessors.com/search/professors/1413?q=
        ${lastName.toLowerCase()}%20${firstName.toLowerCase()}`;
    }
  
    fetch(url)
    .then(function (response) {
        return response.text();
    })
    .then(function (page_html) {
        html = page_html;

        if (html.includes('"resultCount":0')) {
        // professorRating = null;
        // professorID = null;
        // numRatings = null;
        // wouldTakeAgainPercent = null;
        // avgDifficulty = null;
        } else {
        
        let result = html.search( /"avgRating":/g);

        let extractedRating = html.slice(result + 12, result + 15);

        if (/[a-zA-Z\,]/g.test(extractedRating)) {
            professorRating = parseInt(html.slice(result + 12, result + 13));
        } else {
            professorRating = parseFloat(extractedRating);
        }

        // let match = html.match(/"legacyId":\d+/);

        // if (match) {
        //     professorID = match[0].match(/\d+/)[0];
        // }


        // match = html.match(/"numRatings":\d+/);

        // if (match) {
        //     numRatings = match[0].match(/\d+/)[0];
        // }

        
        // match = html.match(/"wouldTakeAgainPercent":\d+(\.\d+)?/);

        // if (match) {
        //     wouldTakeAgainPercent = parseFloat(match[0].match(/\d+(\.\d+)?/));
        // }

        
        // match = html.match(/"avgDifficulty":\d+(\.\d+)?/);

        // if (match) {
        //     avgDifficulty = match[0].match(/\d+(\.\d+)?/)[0];
        // }
        // }


    }
    });
}

function App() {
    const  handleClick = async () => {
        const  pageText  = await getPageText();

        const courseString = getCourseString(pageText)
        const profString = getProfString(pageText)
        
        processCourseString(courseString);
        processProfString(profString);
        
    };

    return (
      <div className="App">
      <div className="Header">
        UBC Workday Hero
      </div>
          <button type="button" onClick={handleClick}>Get Course Grades</button>
      </div>
    );
}

export default App;
