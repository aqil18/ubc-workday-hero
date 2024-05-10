// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'data') {
        console.log('Received data from content script:', message.value);
        // You can store or process the data here
    }
});
