import React from 'react';
import './App.css';
import './utilities';

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

function DOMtoString(selector: any) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
}
function App() {
    const  handleClick = async () => {
        // window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        //     const currentTab = tabs[0];
        //     const courseString = getCourseString(currentTab.url);
        //     console.log(courseString);
        //     const courseJson : any = getCourseJson(courseString);
        //     alert(`Current URL: ${courseJson.average_past_5_yrs}`);
        // });
        //
        // window.chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs: any[]) {
        //     var activeTab = tabs[0];
        //     var activeTabId = activeTab.id;
        //
        //     return window.chrome.scripting.executeScript({
        //         target: { tabId: activeTabId },
        //         injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
        //         func: DOMtoString,
        //         args: ['bodyddf']  // you can use this to target what element to get the html for
        //     });
        //
        // }).then(function (results: { result: any; }[]) {
        //     alert(results[0].result);
        // }).catch(function (error: { message: string; }) {
        //     alert(error.message);
        // }

        const [tab] = await window.chrome.tabs.query({active: true, currentWindow: true});
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
        // process the result
        console.log(result);

    };

    return (
      <div className="App">
          <button type="button" onClick={handleClick}>Get Course Grades</button>
      </div>
    );
}

export default App;
