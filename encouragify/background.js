let scriptRunning = false;

// Define the URL pattern for the website you want the script to run on
const allowedUrlPattern = "https://app.studystream.live/";

// Helper function to get the active tab and ensure the URL matches the allowed pattern
function getActiveTab(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0];
		const tabUrl = tab.url;

		// Only run the script if the tab's URL matches the specific website
		if (tabUrl.startsWith(allowedUrlPattern)) {
			callback(tab);
		} else {
			console.warn("Cannot run script on this page:", tabUrl);
		}
	});
}

// Function to start the content script
function startScript(tab) {
	if (!scriptRunning) {
		chrome.scripting.executeScript(
			{
				target: { tabId: tab.id },
				files: ["content.js"],
			},
			() => {
				scriptRunning = true;
				console.log("Script started on tab:", tab.id);
			}
		);
	} else {
		console.warn("Script is already running!");
	}
}

// Function to stop the content script
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

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	getActiveTab((tab) => {
		if (message.action === "startScript") {
			startScript(tab);
		} else if (message.action === "stopScript") {
			stopScript(tab);
		}
	});
});
