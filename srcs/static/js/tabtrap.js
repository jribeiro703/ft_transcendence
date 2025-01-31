// tab trap
document.addEventListener("DOMContentLoaded", function () {
  const focusableSelectors = [
    "button",
    "[href]",
    "input",
    "select",
    "textarea",
    '[tabindex]:not([tabindex="-1"])',
    "[data-chat-icon]",
    "[data-home-icon]",
    "[data-palette-icon]",
    "[data-profile-icon]",
    "#chat-message-input",
    "#chat-message-submit",
    "#emojiButton",
    ".mapClic",
  ].join(", ");

  const getFocusableElements = () => {
    return Array.from(document.querySelectorAll(focusableSelectors)).filter(
      (element) => {
        return (
          element.offsetParent !== null && // élément visible
          !element.disabled && // pas désactivé
          !element.hasAttribute("hidden") && // pas caché
          getComputedStyle(element).display !== "none" && // pas display none
          getComputedStyle(element).visibility !== "hidden" // pas visibility hidden
        );
      },
    );
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      // Pour debug
      console.log("Focusable elements:", focusableElements);
      console.log("Active element:", activeElement);

      if (e.shiftKey) {
        // Tab arrière
        if (activeElement === firstElement || !activeElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab avant
        if (activeElement === lastElement || !activeElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
});
