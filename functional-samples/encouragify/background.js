let scriptRunning = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const tabUrl = tab.url;

      // Ensure the script runs only on valid pages (e.g., no chrome:// URLs)
      if (!tabUrl.startsWith('chrome://') && !tabUrl.startsWith('chrome-extension://')) {
        if (!scriptRunning) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }, (injectionResults) => {
            if (chrome.runtime.lastError) {
              console.error("Script injection failed:", chrome.runtime.lastError.message);
            } else {
              scriptRunning = true;
              console.log('Script started on tab: ', tab.id);
            }
          });
        }
      } else {
        console.warn('Cannot run script on this page:', tabUrl);
      }
    });
  } else if (message.action === 'stopScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const tabUrl = tab.url;

      if (!tabUrl.startsWith('chrome://') && !tabUrl.startsWith('chrome-extension://')) {
        if (scriptRunning) {
          // Execute the stopApp function in the content script
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              if (typeof stopApp === 'function') {
                stopApp();
              } else {
                console.warn('stopApp function not found');
              }
            }
          }, () => {
            scriptRunning = false;
            console.log('Script stopped on tab: ', tab.id);
          });
        }
      } else {
        console.warn('Cannot stop script on this page:', tabUrl);
      }
    });
  }
});