// DOM Iterator for capturing inputs, buttons, links, menus
const pageElements = {
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
      const uniqueId = `${type}-${pageElements[type].length + 1}`;
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
          pageElements.inputs[label] = { element: node, selector };
        } else {
          const generatedLabel = `unlabeled-${
            Object.keys(pageElements.inputs).length + 1
          }`;
          pageElements.inputs[generatedLabel] = { element: node, selector };
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
          `Button ${pageElements.buttons.length + 1}`;
        pageElements.buttons.push({
          text: buttonText,
          selector: addUniqueSelector(node, "buttons"),
        });
      }

      // Handle links
      if (tagName === "a" && node.href) {
        const linkText =
          node.textContent.trim() || `Link ${pageElements.links.length + 1}`;
        pageElements.links.push({
          text: linkText,
          href: node.href,
          selector: addUniqueSelector(node, "links"),
        });
      }

      // Handle menus or tabs
      if (tagName === "nav" || tagName === "ul" || tagName === "li") {
        const menuText =
          node.textContent.trim() || `Menu ${pageElements.menus.length + 1}`;
        pageElements.menus.push({
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
