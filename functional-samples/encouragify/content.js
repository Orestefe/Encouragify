// Initialize state
let state = {
    currentPage: 1,
    lastPage: 1,
    isRunning: true
  }
  
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
    const pageRange = document.querySelector('ss-paginator > span').textContent.replace(/\s/g, '');
    console.log(pageRange);
    state.isRunning = true;
    console.log('App started');
  
    [state.currentPage, state.lastPage] = pageRange.split('/').map(el => parseInt(el));
    triggerEvents();
  }
  
  function triggerEvents(){
    console.log(state.currentPage)
    console.log(state.isRunning)
    if (state.currentPage < state.lastPage && state.isRunning) {
      console.log(`Triggering events on page ${state.currentPage}`);
      triggerEncourages();
      clickNextPage();
      setTimeout(triggerEvents, 3000);
    } else if(state.currentPage === state.lastPage && state.isRunning) {
      alert('Reached the last page!');
      state.isRunning = false;
    }
  }
  
  function stopApp(){
    state.isRunning = false;
    state.currentPage = 1;
    state.lastPage = 1;
    alert("Stopping app")
  }
  
  startApp();