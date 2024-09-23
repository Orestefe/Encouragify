// Initialize state
let state = {
  currentPage: 1,
  lastPage: 1,
  isRunning: false,  // Initially set to false to avoid multiple runs
};

function triggerEncourages() {
  console.log('Triggering encourages');
  document.querySelectorAll('.thumbs-up').forEach(el => el.click());
}

function clickNextPage() {
  document.querySelector('[class*=chevron_right]').click();
  console.log('Clicking next page');
  state.currentPage++;
}

function startApp() {
  if (!state.isRunning) {
    const pageRange = document.querySelector('ss-paginator > span').textContent.replace(/\s/g, '');
    console.log(pageRange);

    state.isRunning = true;
    console.log('App started');

    [state.currentPage, state.lastPage] = pageRange.split('/').map(el => parseInt(el));
    triggerEvents();
  } else {
    console.warn('App is already running!');
  }
}

function stopApp() {
  if (state.isRunning) {
    state.isRunning = false;
    state.currentPage = 1;
    state.lastPage = 1; 
    alert("Stopping app");
    console.log('App stopped.');
  } else {
    console.warn('App is not running, cannot stop.');
  }
}

function triggerEvents() {
  console.log(state.currentPage);
  console.log(state.isRunning);

  if (state.currentPage < state.lastPage && state.isRunning) {
    console.log(`Triggering events on page ${state.currentPage}`);
    triggerEncourages();
    clickNextPage();
    setTimeout(triggerEvents, 3000);
  } else if (state.currentPage === state.lastPage && state.isRunning) {
    alert('Reached the last page!');
    state.isRunning = false;
  }
}

// Automatically starts the app when injected (only if not already running)
startApp();
