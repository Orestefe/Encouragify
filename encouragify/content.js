(function() {
  let state = {
    currentPage: 1,
    lastPage: 1,
    isRunning: false,
  };

  function triggerEncourages() {
    document.querySelectorAll('.thumbs-up').forEach(el => el.click());
  }

  function clickNextPage() {
    document.querySelector('[class*=chevron_right]').click();
    state.currentPage++;
  }

  function startApp() {
    if (!state.isRunning) {
      const pageRange = document.querySelector('ss-paginator > span').textContent.replace(/\s/g, '');
      state.isRunning = true;
      [state.currentPage, state.lastPage] = pageRange.split('/').map(el => parseInt(el));
      triggerEvents();
    }
  }

  function triggerEvents() {
    if (state.currentPage < state.lastPage && state.isRunning) {
      triggerEncourages();
      clickNextPage();
      setTimeout(triggerEvents, 3000);
    } else if (state.currentPage === state.lastPage && state.isRunning) {
      alert('Reached the last page!');
      state.isRunning = false;
    }
  }

  function stopApp() {
    state.isRunning = false;
    state.currentPage = 1;
    state.lastPage = 1;
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startScript') {
      startApp();
    } else if (message.action === 'stopScript') {
      stopApp();
    }
  });

})();
