// Function to update the status display in the popup
function updatePopupStatus(status) {
	const statusElement = document.getElementById("status");
	if (statusElement) {
		statusElement.textContent = status;
		statusElement.style.color =
			{
				COMPLETE: "#32CD32",
				RUNNING: "#fcfcff",
				STOPPED: "#ff0000",
			}[status] || "#ff0000";
	}
}

// Initialize listeners on buttons
document.getElementById("start").addEventListener("click", () => {
	chrome.runtime.sendMessage({ action: "startScript" });
});

document.getElementById("stop").addEventListener("click", () => {
	chrome.runtime.sendMessage({ action: "stopScript" });
});

// Request the current status when the popup opens
chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
	if (response && response.status) {
		updatePopupStatus(response.status);
	}
});

// Listen for status updates
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "statusUpdate" && message.status) {
		updatePopupStatus(message.status);
	}
});
