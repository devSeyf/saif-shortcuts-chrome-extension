/* global chrome */

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-pin") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let tab = tabs[0];
      if (tab) {
        chrome.tabs.update(tab.id, { pinned: !tab.pinned });
      }
    });
  }
});
