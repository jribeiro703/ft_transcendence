import './friends.js'
import './emoji.js'
import './game.js'
import './general.js'
import './messages.js'
import './notifications.js'
import './online.js'
import './socket.js'
import './tooltip.js'
import './userItem.js'
import './utils.js'
import { chatIconDots, chatIconFill, toggleChat } from './utils.js'

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

// test qui disparait dans le focus de lindex ou on ecrit
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

// liste des icons SVG
const homeIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon chat-icon-fill" viewBox="0 0 512 512" fill="currentColor">
	<path d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z"/>
	<path d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"/>
</svg>
`;

const profileIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" class="chat-icon-fill" viewBox="0 0 512 512" fill="currentColor">
	<title>Profile</title>
	<g id="Profile">
		<g id="Profile-2" data-name="Profile">
			<path d="M256,73.8247a182.1753,182.1753,0,1,0,182.18,182.18A182.1767,182.1767,0,0,0,256,73.8247Zm0,71.8335a55.05,55.05,0,1,1-55.0538,55.0458A55.0458,55.0458,0,0,1,256,145.6582Zm.5193,208.7226H175.6682c0-54.2547,29.5218-73.5732,48.8845-90.9054a65.68,65.68,0,0,0,62.8856,0c19.3626,17.3322,48.8844,36.6507,48.8844,90.9054Z"/>
		</g>
	</g>
</svg>
`;

// ajoute les icons dans le html
document.addEventListener("DOMContentLoaded", function () {
	const chatIcon = document.querySelector("[data-chat-icon]");
	chatIcon.innerHTML = chatIconFill;
	chatIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
	console.log("consol log homeiconsvg", homeIconSvg);
	const homeIcon = document.querySelector("[data-home-icon]");
	homeIcon.innerHTML = homeIconSvg;
	homeIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
	const profileIcon = document.querySelector("[data-profile-icon]");
	profileIcon.innerHTML = profileIconSvg;
	profileIcon.setAttribute("tabindex", "0");
});

// slide le livechat avec focus touche entrer + clic souris

document
	.querySelector("[data-chat-icon]")
	.addEventListener("click", toggleChat);

// can click with enter
document.addEventListener("DOMContentLoaded", function () {
	const homeIcon = document.querySelector("[data-home-icon]");
	const profileIcon = document.querySelector("[data-profile-icon]");
	const chatIcon = document.querySelector("[data-chat-icon]");

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
});

// rend jolie apres avoir cliqué a la souris
document.addEventListener("mousedown", function (event) {
	const focusableSelectors = [
		"button",
		"[data-chat-icon]",
		"[data-home-icon]",
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
		"[data-profile-icon]",
		"#chat-message-input",
		"#chat-message-submit",
		"#emojiButton",
	].join(", ");

	const getFocusableElements = () => {
		return Array.from(document.querySelectorAll(focusableSelectors)).filter(
			(element) => {
				return (
					element.offsetParent !== null &&
					!element.disabled &&
					getComputedStyle(element).display !== "none"
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

			if (e.shiftKey) {
				if (activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				}
			} else {
				if (activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		}
	});
});
