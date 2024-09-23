let scriptRunning = false;

// Helper function to query active tab and check if URL is valid
function getActiveTab(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0];
		const tabUrl = tab.url;

		// Ensure the script is running on a valid page
		if (
			!tabUrl.startsWith("chrome://") &&
			!tabUrl.startsWith("chrome-extension://")
		) {
			callback(tab);
		} else {
			console.warn("Cannot run/stop script on this page:", tabUrl);
		}
	});
}

// Injects content.js and starts the script
function startScript(tab) {
	if (!scriptRunning) {
		chrome.scripting.executeScript(
			{
				target: { tabId: tab.id },
				files: ["content.js"],
			},
			(injectionResults) => {
				if (chrome.runtime.lastError) {
					console.error(
						"Script injection failed:",
						chrome.runtime.lastError.message
					);
				} else {
					scriptRunning = true;
					console.log("Script started on tab:", tab.id);
				}
			}
		);
	} else {
		console.warn("Script is already running!");
	}
}

// Stops the script by invoking stopApp() in content.js
function stopScript(tab) {
	if (scriptRunning) {
		chrome.scripting.executeScript(
			{
				target: { tabId: tab.id },
				func: () => {
					if (typeof stopApp === "function") {
						stopApp();
					}
				},
			},
			() => {
				scriptRunning = false;
				console.log("Script stopped on tab:", tab.id);
			}
		);
	} else {
		console.warn("No script is running to stop.");
	}
}

// Handles messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	getActiveTab((tab) => {
		if (message.action === "startScript") {
			startScript(tab);
		} else if (message.action === "stopScript") {
			stopScript(tab);
		}
	});
});
