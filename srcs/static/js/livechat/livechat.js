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
import gameVar from "../game/pong/var.js";

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// David add ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
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

// ajoute les icons dans le html
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.querySelector("[data-chat-icon]");
  chatIcon.innerHTML = chatIconFill;
  chatIcon.setAttribute("tabindex", "0");
});

// slide le livechat avec focus touche entrer + clic souris
const themes = [
  "whiteTheme",
  "darkTheme",
  "neonBlue",
  "Transcended",
  "darkYellow",
];
let currentThemeIndex = 0;

export function changeTheme(theme) {
  const body = document.body;
  if (theme) {
    body.classList.add(theme);
  } else {
    console.log("changeTHeme");
    themes.forEach((theme) => body.classList.remove(theme));

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    body.classList.add(themes[currentThemeIndex]);
    gameVar.currentTheme = themes[currentThemeIndex];
    console.log("theme changed to: ", themes[currentThemeIndex]);

    console.log("change theme currentheme:", gameVar.currentTheme);
  }
}

document
  .querySelector("[data-chat-icon]")
  .addEventListener("click", toggleChat);
