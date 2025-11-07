// [CV-6] CONSTANTS
const API_ENDPOINT = "https://webhook.site/1a0e08a8-a013-480f-8e03-ee34930a1d26";

// 1. Create the menu item when installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-with-ai",
    title: "Explain with AI",
    contexts: ["selection"],
  });
});

// 2. Listen for the click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "explain-with-ai") {
    // 1. PREPARE PAYLOAD
    const payload = {
        word: info.selectionText,
        url: info.pageUrl,
        title: tab.title
    };
    console.log("[CAV-3] Sending payload:", payload);

    try {
        // 2. SEND THE POST REQUEST
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // 3. LOG RESULT
        console.log("[CV-6] Response received:", response.status);

    } catch (error) {
        console.error("[CV-6] Network Error:", error);
    }
  }
});