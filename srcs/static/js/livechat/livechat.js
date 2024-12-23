import "./friends.js";
import "./emoji.js";
import "./game.js";
import "./general.js";
import "./messages.js";
import "./notifications.js";
import "./online.js";
import "./socket.js";
import "./tooltip.js";
import "./userItem.js";
import "./utils.js";
import { chatIconDots, chatIconFill, toggleChat } from "./utils.js";

// ajoute les neons dans le focus
document.addEventListener("DOMContentLoaded", function () {
  const grandparent = document.getElementById("livechat");
  const focusableElements = [
    "emojiButton",
    "chat-message-input",
    "chat-message-submit",
  ];

  focusableElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("focus", function () {
        grandparent.classList.add("livechat-neon-focus");
      });

      element.addEventListener("blur", function () {
        grandparent.classList.remove("livechat-neon-focus");
      });
    }
  });
});

// text qui disparait dans le focus de lindex ou on ecrit
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.querySelector("#chat-message-input");

  if (messageInput) {
    messageInput.addEventListener("focus", function () {
      messageInput.placeholder = "";
    });

    messageInput.addEventListener("blur", function () {
      messageInput.placeholder = "Type here...";
    });
  } else {
    console.error("Message input not found");
  }
});

// ajoute licon du livechat dans le html
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.querySelector("[data-chat-icon]");
  chatIcon.innerHTML = chatIconFill;
  chatIcon.setAttribute("tabindex", "0");
});

document
  .querySelector("[data-chat-icon]")
  .addEventListener("click", toggleChat);
