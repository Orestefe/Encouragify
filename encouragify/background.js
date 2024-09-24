let scriptRunning = false;
let currentStatus = "STOPPED"; // Track the current status

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// Handle startScript/stopScript actions
	if (message.action === "startScript") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0];
			const tabUrl = tab.url;

			if (!scriptRunning) {
				// Inject the content script
				chrome.scripting.executeScript(
					{
						target: { tabId: tab.id },
						files: ["content.js"],
					},
					() => {
						if (chrome.runtime.lastError) {
							console.error(
								"Script injection failed:",
								chrome.runtime.lastError.message
							);
						} else {
							scriptRunning = true;
							currentStatus = "RUNNING"; // Set the status to "RUNNING"
							console.log("Script started on tab:", tab.id);
						}
					}
				);
			}
		});
	} else if (message.action === "stopScript") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0];

			if (scriptRunning) {
				chrome.scripting.executeScript(
					{
						target: { tabId: tab.id },
						func: () => {
							if (typeof stopApp === "function") stopApp();
						},
					},
					() => {
						scriptRunning = false;
						currentStatus = "STOPPED"; // Set the status to "STOPPED"
						console.log("Script stopped on tab:", tab.id);
					}
				);
			}
		});
	}

	// Handle status updates from content.js
	if (message.action === "statusUpdate" && message.status) {
		currentStatus = message.status;
		// Forward the status update to the popup
		chrome.runtime.sendMessage({
			action: "statusUpdate",
			status: currentStatus,
		});
	}

	// Handle status request from popup.js
	if (message.action === "getStatus") {
		sendResponse({ status: currentStatus });
	}
});
