// This runs when Chrome first installs (or updates) the extension
chrome.runtime.onInstalled.addListener(() => {
  // Create the right-click menu item
  chrome.contextMenus.create({
    id: "explain-with-ai",
    title: "Explain with AI",
    contexts: ["selection"], // Only show when text is selected
  });
});

// This runs when the user clicks our menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-with-ai") {
    // For now, just log it to prove it worked
    console.log("User clicked 'Explain with AI'");
    console.log("Selected text:", info.selectionText);
  }
});