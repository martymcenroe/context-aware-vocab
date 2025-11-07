// 1. Create the menu item when installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-with-ai",
    title: "Explain with AI",
    contexts: ["selection"],
  });
});

// 2. Listen for the click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-with-ai") {
    // --- CAPTURE PHASE ---
    const dataToAnalyze = {
        word: info.selectionText,
        url: info.pageUrl,
        title: tab.title // We get this for free from the 'tab' object
    };

    // --- LOGGING PHASE (Proving it worked) ---
    console.log(" [CAV-2] Capture Success! payload prepared:");
    console.log(dataToAnalyze);
  }
});