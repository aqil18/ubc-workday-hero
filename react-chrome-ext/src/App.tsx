import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import './App.css';
const UBCGRADES: string  = 'https://ubcgrades.com/api/v3/course-statistics/UBCV/'
let courseJson;
let profUrl;


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
    let courseDict: Record<string, number> = {};

    try {
        const courseJson = await getCourseJson(courseString);
        courseDict["average"] = courseJson.average;
        courseDict["average5"] = courseJson.average_past_5_yrs;
        courseDict["max"] = courseJson.max_course_avg;
        courseDict["min"] = courseJson.min_course_avg;
        return courseDict
    } catch (error) {
        console.error('Error processing course string:', error);
    }
}
function processProfString(profString : string) {
    let firstName = profString.trim().split(" ")[0]
    let lastName = profString.trim().split(" ")[1]
    let url = "";
    
    if (profString.length > 1) {
        url = `https://www.ratemyprofessors.com/search/professors/1413?q=
        ${lastName.toLowerCase()}%20${firstName.toLowerCase()}`;
    }
  
    return url;
}

function App() {
    const [average, setAverage] = useState("N/A");
    const [average5, setAverage5] = useState("N/A");
    const [max, setMax] = useState("N/A");
    const [min, setMin] = useState("N/A");
    const [profUrl, setProfUrl] = useState("N/A");


    useEffect(() => {
        const fetchData = async () => {
            const pageText = await getPageText();

            const courseString = getCourseString(pageText);
            const profString = getProfString(pageText);

            const courseDict : any = await processCourseString(courseString);
            setAverage(courseDict["average"]);
            setAverage5(courseDict["average5"]);
            setMax(courseDict["max"]);
            setMin(courseDict("min"));

            const profUrl = processProfString(profString);
            setProfUrl(profUrl);
            
            console.log(courseDict, profUrl);
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once after the initial render


    return (
        <div className="container-fluid">
            <div className="title">
                <section className="title-content">
                    UBC Workday Hero
                </section>
            </div>
            <div className='content-upper'>
                <section className="upper-section">
                    <h1 className='style2'>Grades</h1>
                    <p className='style1'>Overall: {average} Past Years: {average5} Max: {max} Min: {min}</p>
                </section>
            </div>
            <div className='content-bottom'>
                <section className="bottom-section">
                <h1>Prof Section</h1>
                <p>RateMyProf Link: {profUrl}</p>
                </section>
                <section></section>
            </div>
        </div>
    );
}

export default App;
