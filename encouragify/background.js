const STATUS_RUNNING = "RUNNING";
const STATUS_STOPPED = "STOPPED";
const ACTION_START_SCRIPT = "startScript";
const ACTION_STOP_SCRIPT = "stopScript";
const ACTION_STATUS_UPDATE = "statusUpdate";
const ACTION_GET_STATUS = "getStatus";

let scriptRunning = false;
let currentStatus = STATUS_STOPPED;

// Utility function to query the active tab
function queryActiveTab(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length > 0) {
			const tab = tabs[0];
			callback(tab);
		} else {
			console.error("No active tab found.");
		}
	});
}

// Utility function to execute scripts in the active tab
function executeScriptInTab(tabId, funcOrFiles, callback) {
	const options =
		typeof funcOrFiles === "function"
			? { func: funcOrFiles }
			: { files: funcOrFiles };

	chrome.scripting.executeScript(
		{
			target: { tabId },
			...options,
		},
		callback
	);
}

// Helper function to update the script status
function updateStatus(newStatus) {
	currentStatus = newStatus;
	chrome.runtime.sendMessage({
		action: ACTION_STATUS_UPDATE,
		status: newStatus,
	});
}

// Message listener for actions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	queryActiveTab((tab) => {
		switch (message.action) {
			case ACTION_START_SCRIPT:
				if (!scriptRunning) {
					executeScriptInTab(tab.id, ["content.js"], () => {
						if (chrome.runtime.lastError) {
							console.error(
								"Script injection failed:",
								chrome.runtime.lastError.message
							);
						} else {
							scriptRunning = true;
							updateStatus(STATUS_RUNNING);
							console.log("Script started on tab:", tab.id);
						}
					});
				}
				break;

			case ACTION_STOP_SCRIPT:
				if (scriptRunning) {
					executeScriptInTab(
						tab.id,
						() => {
							if (typeof stopApp === "function") stopApp();
						},
						() => {
							scriptRunning = false;
							updateStatus(STATUS_STOPPED);
							console.log("Script stopped on tab:", tab.id);
						}
					);
				}
				break;

			case ACTION_STATUS_UPDATE:
				if (message.status) {
					updateStatus(message.status);
				}
				break;

			case ACTION_GET_STATUS:
				sendResponse({ status: currentStatus });
				break;

			default:
				console.warn(`Unknown action: ${message.action}`);
		}
	});
});
