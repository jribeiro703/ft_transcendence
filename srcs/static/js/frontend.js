import { toggleChat } from "./livechat/utils.js";

// mainAndLiveChat adapt gap and
document.addEventListener("DOMContentLoaded", (event) => {
  const mainAndLivechat = document.getElementById("mainAndLivechat");
  const livechat = document.getElementById("livechat");

  function updateGap() {
    if (livechat && livechat.clientWidth > 0) {
      mainAndLivechat.classList.add("has-visible-livechat");
    } else {
      mainAndLivechat.classList.remove("has-visible-livechat");
    }
  }

  updateGap();

  const resizeObserver = new ResizeObserver(updateGap);
  resizeObserver.observe(livechat);
});

// deselect les icon apres le click
document.addEventListener("mousedown", function (event) {
  const focusableSelectors = [
    "button",
    "[data-chat-icon]",
    "[data-home-icon]",
    "[data-palette-icon]",
    "[data-profile-icon]",
    "#chat-message-submit",
    "#emojiButton",
  ];

  const target = event.target;

  if (
    target.matches(focusableSelectors) ||
    target.closest(focusableSelectors)
  ) {
    requestAnimationFrame(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    });
  }
});

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

// can click and press enter
document.addEventListener("DOMContentLoaded", function () {
  const homeIcon = document.querySelector("[data-home-icon]");
  const profileIcon = document.querySelector("[data-profile-icon]");
  const chatIcon = document.querySelector("[data-chat-icon]");
  const paletteIcon = document.querySelector("[data-palette-icon]");

  if (homeIcon) {
    homeIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        homeIcon.click();
      }
    });
  }

  if (profileIcon) {
    profileIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        profileIcon.click();
      }
    });
  }

  if (chatIcon) {
    chatIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        toggleChat();
      }
    });
  }

  if (paletteIcon) {
    paletteIcon.addEventListener("click", function () {
      changeTheme();
    });
  }
});
