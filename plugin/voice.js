// Check if SpeechRecognition API is available
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("SpeechRecognition API is not supported in this browser.");
} else {
  console.log("SpeechRecognition API is supported. Starting...");

  // Initialize SpeechRecognition
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US"; // Set language
  recognition.continuous = false; // Listen for one command at a time
  recognition.interimResults = false; // Return only final results

  // Start listening
  recognition.start();
  console.log("Listening for a voice command...");

  // Handle recognition results
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    console.log("Recognized command:", command);

    // Handle Select Command for Inputs, Buttons, Links, and Menus
    if (command.startsWith("select") || command.startsWith("go to")) {
      handleSelectCommand(command);
    }

    // Handle Fill Command for Inputs
    if (command.startsWith("fill") || command.startsWith("enter")) {
      handleFillCommand(command);
    }
  };

  // Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    recognition.start();
  };

  // Log when recognition ends
  recognition.onend = () => {
    console.log("Speech recognition stopped.");
    recognition.start();
  };
}

// Store actionable elements
const capturedElements = {
  inputs: {}, // Inputs mapped by label, placeholder, or generated selector
  buttons: [], // Buttons with their text or unique selector
  links: [], // Links with their text or unique selector
  menus: [], // Menu items with their text or unique selector
  tabs: [], // Tabs with their text or unique selector
};

// Function to iterate through DOM and capture actionable elements
function iterateDOMAndCapture() {
  const addUniqueSelector = (element, type) => {
    // Generate a unique selector if one doesn't exist
    if (!element.hasAttribute("data-selector")) {
      const uniqueId = `${type}-${capturedElements[type].length + 1}`;
      element.setAttribute("data-selector", uniqueId);
    }
    return element.getAttribute("data-selector");
  };

  // Recursive function to iterate through child nodes
  function traverse(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      // Handle inputs (text, password, etc.)
      if (["input", "textarea", "select"].includes(tagName)) {
        const label =
          node.labels && node.labels.length
            ? node.labels[0].textContent.trim().toLowerCase()
            : node.getAttribute("placeholder") ||
              node.getAttribute("aria-label") ||
              null;

        const selector = addUniqueSelector(node, "inputs");
        if (label) {
          capturedElements.inputs[label] = { element: node, selector };
        } else {
          const generatedLabel = `unlabeled-${
            Object.keys(capturedElements.inputs).length + 1
          }`;
          capturedElements.inputs[generatedLabel] = { element: node, selector };
        }
      }

      // Handle buttons
      if (
        tagName === "button" ||
        (tagName === "input" && ["button", "submit"].includes(node.type))
      ) {
        const buttonText =
          node.textContent.trim() ||
          node.value ||
          `Button ${capturedElements.buttons.length + 1}`;
        capturedElements.buttons.push({
          text: buttonText,
          selector: addUniqueSelector(node, "buttons"),
        });
      }

      // Handle links
      if (tagName === "a" && node.href) {
        const linkText =
          node.textContent.trim() ||
          `Link ${capturedElements.links.length + 1}`;
        capturedElements.links.push({
          text: linkText,
          href: node.href,
          selector: addUniqueSelector(node, "links"),
        });
      }

      // Handle menus or tabs
      if (tagName === "nav" || tagName === "ul" || tagName === "li") {
        const menuText =
          node.textContent.trim() ||
          `Menu ${capturedElements.menus.length + 1}`;
        capturedElements.menus.push({
          text: menuText,
          selector: addUniqueSelector(node, "menus"),
        });
      }

      // Handle child nodes recursively
      Array.from(node.children).forEach((child) => traverse(child));
    }
  }

  // Start traversing from the root document body
  traverse(document.body);
}

// Call the function to initialize element capture
iterateDOMAndCapture();

// Highlight an element by selector
function highlightElementBySelector(selector) {
  const element = document.querySelector(`[data-selector="${selector}"]`);
  if (element) {
    clearHighlights(); // Clear existing highlights
    element.classList.add("highlight"); // Add highlight class
    element.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll to the element
  }
}

// Clear all highlights
function clearHighlights() {
  document
    .querySelectorAll(".highlight")
    .forEach((el) => el.classList.remove("highlight"));
}

// Handle Select Command
function handleSelectCommand(command) {
  let target;

  // Handling "select" for inputs
  const inputMatch =
    command.match(/select (.+)/) || command.match(/go to (.+)/);
  if (inputMatch) {
    target = inputMatch[1].trim();

    const input =
      capturedElements.inputs[target] ||
      Object.values(capturedElements.inputs).find(
        (item) => item.selector.toLowerCase() === target.toLowerCase()
      );
    if (input) {
      highlightElementBySelector(input.selector);
      input.element.focus(); // Focus on the input
      console.log(`Focused on input: ${target}`);
      return;
    }
  }

  // Handling "select" for buttons
  const buttonMatch = command.match(/select button (.+)/);
  if (buttonMatch) {
    target = buttonMatch[1].trim();

    const button = capturedElements.buttons.find((item) =>
      item.text.toLowerCase().includes(target.toLowerCase())
    );
    if (button) {
      highlightElementBySelector(button.selector);
      button.element.click(); // Click the button
      console.log(`Button clicked: ${target}`);
      return;
    }
  }

  // Handling "select" for links
  const linkMatch = command.match(/select link (.+)/);
  if (linkMatch) {
    target = linkMatch[1].trim();

    const link = capturedElements.links.find((item) =>
      item.text.toLowerCase().includes(target.toLowerCase())
    );
    if (link) {
      highlightElementBySelector(link.selector);
      link.element.click(); // Open the link
      console.log(`Link clicked: ${target}`);
      return;
    }
  }

  // Handling "select" for menus
  const menuMatch = command.match(/select menu (.+)/);
  if (menuMatch) {
    target = menuMatch[1].trim();

    const menu = capturedElements.menus.find((item) =>
      item.text.toLowerCase().includes(target.toLowerCase())
    );
    if (menu) {
      highlightElementBySelector(menu.selector);
      menu.element.click(); // Open the menu
      console.log(`Menu item clicked: ${target}`);
      return;
    }
  }
}

// Handle Fill Command for Inputs
function handleFillCommand(command) {
  const [_, field, value] =
    command.match(/fill (.+) with (.+)/) ||
    command.replace(/enter (.+) with (.+)/, "").trim() ||
    [];
  if (field && value) {
    const input = capturedElements.inputs[field];
    if (input) {
      input.element.value = value; // Fill the input field
      console.log(`Filled ${field} with ${value}`);
    }
  }
}

// Add highlight class styling
const style = document.createElement("style");
style.textContent = `
  .highlight {
    border: 2px solid blue !important;
    outline: none !important;
  }
`;
document.head.appendChild(style);
