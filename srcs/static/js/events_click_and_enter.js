// can click with enter
document.addEventListener("DOMContentLoaded", function () {
  const homeIcon = document.querySelector("[data-home-icon]");
  const profileIcon = document.querySelector("[data-profile-icon]");
  const chatIcon = document.querySelector("[data-chat-icon]");
  const paletteIcon = document.querySelector("[data-palette-icon]");

  if (homeIcon) {
    homeIcon.setAttribute("tabindex", "0");
    homeIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        homeIcon.click();
      }
    });
  }

  if (profileIcon) {
    profileIcon.setAttribute("tabindex", "0");
    profileIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        profileIcon.click();
      }
    });
  }

  if (chatIcon) {
    chatIcon.setAttribute("tabindex", "0");
    chatIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        toggleChat();
      }
    });
  }

  if (paletteIcon) {
    paletteIcon.setAttribute("tabindex", 0);
    paletteIcon.addEventListener("click", function () {
      changeTheme();
    });
  }
});

// unfocus after click
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
