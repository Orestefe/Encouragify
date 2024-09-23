let scriptRunning = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const tabUrl = tab.url;

    if (!tabUrl.startsWith('chrome://') && !tabUrl.startsWith('chrome-extension://')) {
      if (message.action === 'startScript' && !scriptRunning) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }, (injectionResults) => {
          if (chrome.runtime.lastError) {
            console.error("Script injection failed:", chrome.runtime.lastError.message);
          } else {
            scriptRunning = true;
            console.log('Script started on tab:', tab.id);
          }
        });
      } else if (message.action === 'stopScript' && scriptRunning) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (typeof stopApp === 'function') {
              stopApp();
            }
          }
        }, () => {
          scriptRunning = false;
          console.log('Script stopped on tab:', tab.id);
        });
      }
    } else {
      console.warn('Cannot run/stop script on this page:', tabUrl);
    }
  });
});