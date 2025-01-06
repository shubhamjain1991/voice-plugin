chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    console.error("No tab ID found!");
    return;
  }

  // Inject the DOM iteration script
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["domIterator.js"], // Script to iterate the DOM
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error injecting DOM iteration script:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("DOM iteration script injected successfully.");
      }
    }
  );

  // Inject the voice processing script
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["voice.js"], // Script to handle voice commands
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error injecting voice processing script:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("Voice processing script injected successfully.");
      }
    }
  );
});
