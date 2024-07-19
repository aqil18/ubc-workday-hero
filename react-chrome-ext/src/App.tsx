import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import './App.css';
const UBCGRADES: string  = 'https://ubcgrades.com/api/v3/course-statistics/UBCV/';
import axios from 'axios';


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
        courseDict["average"] = courseJson.average.toFixed(2);
        courseDict["average5"] = courseJson.average_past_5_yrs.toFixed(2);
        courseDict["max"] = courseJson.max_course_avg.toFixed(2);
        courseDict["min"] = courseJson.min_course_avg.toFixed(2);
        return courseDict
    } catch (error) {
        console.error('Error processing course string:', error);
    }
}

async function processProfString(profString : string) {
    try {
        const response = await axios.post('http://localhost:5000/process', { input: profString });
        return response.data
    } catch (error) {
      console.error('Error sending data to Flask:', error);
    }
  };

function App() {
    const [average, setAverage] = useState("N/A");
    const [average5, setAverage5] = useState("N/A");
    const [max, setMax] = useState("N/A");
    const [min, setMin] = useState("N/A");    

    const [profJson, setProfJson] = useState({
        "rating" : 0,
        "difficulty" : 0,
        "num_ratings": 0,
        "would_take_again" : 0 
    });

    useEffect(() => {
        const fetchData = async () => {
            const pageText = await getPageText();

            const courseString = getCourseString(pageText);
            const profString = getProfString(pageText);

            const courseDict : any = await processCourseString(courseString);
            setAverage(courseDict["average"]);
            setAverage5(courseDict["average5"]);
            setMax(courseDict["max"]);
            setMin(courseDict["min"]);

            const json : any = await processProfString(profString);
            setProfJson(json);

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
                    <section className='style2'>UBC Grades Stats</section>
                    
                    <div className='flexbox-container'>
                        <div className='square'>
                            <section className='style2'>{average}</section>
                            <section className='style1'> Overall Avg</section>
                        </div>
                        <div className='square'>
                            <section className='style2'> {average5}</section>
                            <section className='style1'> Past 5 Years Avg</section>
                        </div> 
                        <div className='square'>
                            <section className='style2'> {max} </section>
                            <section className='style1'> Max Avg </section>
                        </div>
                        <div className='square'>
                            <section className='style2'>{min}</section>
                            <section className='style1'>Min Avg</section>
                        </div>
                    </div>
                
                
                </section>
            </div>
            <div className='content-bottom'>
                <section className="bottom-section">
                    <h1 className='style2'>Rate My Professor Stats</h1>
                    
                    <div className='flexbox-container'>
                        <div className='square'>
                            <section className='style2'>{profJson.rating}/5</section>
                            <section className='style1'>Prof Rating</section>
                        </div>
                        <div className='square'>
                            <section className='style2'>{profJson.difficulty}/5</section>
                            <section className='style1'>Prof Difficulty</section>
                        </div> 
                        <div className='square'>
                            <section className='style2'>{profJson.num_ratings}</section>
                            <section className='style1'>No. of Reviews</section>
                        </div>
                        <div className='square'>
                            <section className='style2'>{profJson.would_take_again}%</section>
                            <section className='style1'>Would Take Again</section>
                        </div>
                    </div>

                </section>
                <section></section>
            </div>
        </div>
    );
}

export default App;
