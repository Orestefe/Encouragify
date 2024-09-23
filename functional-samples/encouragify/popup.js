  // Initialize listeners on buttons
  document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startScript' });
  });
  
  document.getElementById('stop').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopScript' });
  });