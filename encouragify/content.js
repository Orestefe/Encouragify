(function () {
	let state = {
		currentPage: 1,
		lastPage: 1,
		isRunning: false, // Initially set to false to avoid multiple runs
	};

	function updatePageState() {
		const pageRange = document
			.querySelector("ss-paginator > span")
			.textContent.replace(/\s/g, "");
		[state.currentPage, state.lastPage] = pageRange.split("/").map(Number);
	}

	function updateStatusDisplay() {
		let status = state.isRunning
			? state.currentPage < state.lastPage
				? "RUNNING"
				: "COMPLETE"
			: "STOPPED";

		chrome.runtime.sendMessage({ action: "statusUpdate", status });
	}

	function triggerEncourages() {
		document.querySelectorAll(".thumbs-up").forEach((el) => el.click());
	}

	function clickNextPage() {
		document.querySelector("[class*=chevron_right]").click();
		state.currentPage++;
	}

	function triggerEvents() {
		if (state.currentPage < state.lastPage && state.isRunning) {
			triggerEncourages();
			clickNextPage();
			setTimeout(() => {
				updatePageState();
				updateStatusDisplay();
				triggerEvents();
			}, 3000);
		} else if (state.currentPage === state.lastPage && state.isRunning) {
			updateStatusDisplay(); // Show "COMPLETE"
			resetState(); // Reset after completion
		}
	}

	function startApp() {
		if (!state.isRunning) {
			state.isRunning = true;
			updatePageState();
			updateStatusDisplay();
			triggerEvents();
		}
	}

	function stopApp() {
		if (state.isRunning) {
			updateStatusDisplay(); // Show "STOPPED"
			resetState();
		}
	}

	function resetState() {
		state.isRunning = false;
		state.currentPage = 1;
		state.lastPage = 1;
	}

	startApp(); // Automatically starts the app

	window.stopApp = stopApp;
})();
