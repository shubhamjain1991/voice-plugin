const iframe = document.createElement("iframe");
iframe.setAttribute("hidden", "hidden");
iframe.setAttribute("id", "permissionsIFrame");
iframe.setAttribute("allow", "microphone");
iframe.src = chrome.runtime.getURL("requestPermissions.html");
document.body.appendChild(iframe);

// Listen for messages from the background script

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "changeColor") {
//     const color = message.color;
//     console.log("Changing background color to:", color);

//     // Change the background color of the page
//     document.body.style.backgroundColor = color;

//     // Optionally, send a response back to confirm the action
//     sendResponse({ success: true });
//   }
// });

console.log("hi from content.js");

// Check for browser support
// Check if the SpeechRecognition API is available
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

// if (!SpeechRecognition) {
//   console.error("SpeechRecognition API is not supported in this browser.");
// } else {
//   console.log("SpeechRecognition API is supported. Starting...");

//   // Initialize SpeechRecognition
//   const recognition = new SpeechRecognition();
//   recognition.lang = "en-US"; // Language for recognition
//   recognition.continuous = false; // Stop after a single phrase
//   recognition.interimResults = false; // Only log final results

//   // Start recognition
//   recognition.start();
//   console.log("Listening for voice input...");

//   // Log recognized speech
//   recognition.onresult = (event) => {
//     const command = event.results[0][0].transcript.trim();
//     console.log("Recognized command:", command);
//     alert(`You said: ${command}`); // Alert for immediate feedback
//   };

//   // Handle errors
//   recognition.onerror = (event) => {
//     console.error("Speech recognition error:", event.error);
//     alert(`Error: ${event.error}`); // Alert for immediate feedback on errors
//   };

//   // Log when recognition starts
//   recognition.onstart = () => {
//     console.log("Speech recognition started. Speak now...");
//   };

//   // Log when recognition stops
//   recognition.onend = () => {
//     console.log("Speech recognition stopped.");
//     alert(
//       "Speech recognition ended. Click the extension icon again to restart."
//     );
//   };
// }
