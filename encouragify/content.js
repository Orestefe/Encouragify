(function () {
	// Initialize state only inside the IIFE
	let state = {
		currentPage: 1,
		lastPage: 1,
		isRunning: false, // Initially set to false to avoid multiple runs
	};

	function updatePageState() {
		const pageRange = document
			.querySelector("ss-paginator > span")
			.textContent.replace(/\s/g, "");

		[state.currentPage, state.lastPage] = pageRange
			.split("/")
			.map((el) => parseInt(el));
	}

	function updateStatusDisplay() {
		let status;

		if (state.isRunning) {
			if (state.currentPage < state.lastPage) {
				status = "RUNNING"; // When running and not on the last page
			} else if (state.currentPage === state.lastPage) {
				status = "COMPLETE"; // When on the last page and still running
			}
		} else {
			status = "STOPPED"; // Only when the user clicks "stop"
		}

		// Send status update to background script
		chrome.runtime.sendMessage({ action: "statusUpdate", status });
	}

	function triggerEncourages() {
		document.querySelectorAll(".thumbs-up").forEach((el) => el.click());
	}

	function clickNextPage() {
		document.querySelector("[class*=chevron_right]").click();
		state.currentPage++;
	}

	function startApp() {
		if (!state.isRunning) {
			state.isRunning = true;
			updatePageState(); // Ensure page state is updated before displaying status
			updateStatusDisplay(); // Show "RUNNING" initially
			triggerEvents();
		}
	}

	function triggerEvents() {
		if (state.currentPage < state.lastPage && state.isRunning) {
			triggerEncourages();
			clickNextPage();
			setTimeout(() => {
				updatePageState(); // Update page state after the page click
				updateStatusDisplay(); // Show "RUNNING" while progressing
				triggerEvents();
			}, 3000);
		} else if (state.currentPage === state.lastPage && state.isRunning) {
			updateStatusDisplay(); // Show "COMPLETE"
			resetState(); // Reset the script state after completion
		}
	}

	function stopApp() {
		if (state.isRunning) {
			updateStatusDisplay(); // Show "STOPPED" only when the user manually stops the app
			resetState(); // Reset the state when stopped manually
		}
	}

	// Reset the script state so it can be run again
	function resetState() {
		state.isRunning = false;
		state.currentPage = 1;
		state.lastPage = 1;
	}

	// Automatically starts the app when injected (only if not already running)
	startApp();

	// Expose stopApp function globally, so it can be called from background.js
	window.stopApp = stopApp;
})();
