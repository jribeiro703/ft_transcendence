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

const paletteIconSvg = `
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="currentColor" stroke="none">
<path d="M4416 4845 c-214 -88 -516 -411 -749 -802 -129 -216 -312 -546 -407
-734 l-79 -156 -43 7 c-57 11 -140 -4 -204 -35 -114 -56 -215 -203 -249 -362
-38 -179 -73 -245 -159 -293 -28 -16 -65 -43 -81 -60 -26 -27 -30 -39 -30 -85
0 -74 22 -100 141 -162 297 -155 578 -147 794 23 181 142 259 375 201 599
l-18 69 196 196 c211 210 483 504 590 638 187 234 352 566 397 799 26 136 12
255 -37 317 -53 68 -158 84 -263 41z m-1039 -2260 c80 -56 -23 -237 -185 -323
-66 -35 -165 -62 -230 -62 -93 0 -264 50 -350 102 l-32 20 44 29 c62 41 110
97 147 171 17 35 33 65 35 67 8 9 37 -26 73 -93 48 -86 77 -115 124 -123 50
-8 99 23 187 119 93 102 141 125 187 93z"/>
<path d="M2390 4583 c-96 -7 -260 -36 -373 -64 -954 -246 -1627 -1114 -1627
-2102 0 -1104 840 -2034 1950 -2158 133 -15 443 -6 565 15 138 25 290 65 395
103 892 329 1462 1180 1427 2128 -9 239 -45 342 -156 448 -109 104 -200 135
-422 141 l-155 5 -146 -147 -147 -147 11 -55 c6 -30 8 -100 5 -155 -10 -185
-74 -330 -207 -465 -258 -262 -644 -301 -1023 -102 -111 58 -161 101 -193 164
-70 137 -20 305 111 379 78 44 101 75 120 166 50 234 132 380 268 477 76 54
147 83 235 96 37 5 68 13 69 17 2 4 55 105 119 223 64 118 130 241 147 272 29
56 30 60 31 211 l1 153 -42 86 c-51 102 -133 185 -229 230 -136 64 -472 101
-734 81z m20 -459 c79 -35 160 -121 190 -201 31 -82 26 -205 -12 -285 -33 -71
-101 -138 -176 -175 -50 -24 -69 -27 -152 -28 -85 0 -101 3 -154 29 -76 37
-140 101 -174 174 -24 50 -27 70 -27 157 0 88 3 106 27 155 47 96 142 174 245
200 63 16 166 4 233 -26z m-880 -886 c111 -52 187 -149 209 -270 29 -158 -61
-325 -212 -394 -53 -24 -74 -28 -147 -28 -74 0 -93 4 -151 32 -77 37 -150 109
-182 180 -32 71 -35 200 -8 274 41 106 127 189 234 224 67 22 190 13 257 -18z
m30 -1129 c94 -24 186 -105 232 -205 19 -40 23 -66 23 -144 0 -85 -3 -101 -29
-154 -37 -76 -101 -140 -174 -174 -50 -24 -70 -27 -157 -27 -89 0 -106 3 -157
28 -73 36 -149 119 -179 195 -17 42 -22 78 -23 137 0 106 34 183 110 255 100
95 217 124 354 89z m2358 -149 c126 -67 195 -180 195 -320 0 -99 -28 -172 -94
-245 -172 -187 -469 -149 -589 77 -28 53 -35 76 -38 144 -9 167 72 296 226
361 49 20 70 23 147 20 80 -3 97 -7 153 -37z m-1248 -473 c67 -25 155 -109
190 -182 21 -43 25 -65 25 -150 0 -88 -3 -107 -27 -157 -96 -206 -361 -273
-547 -138 -90 66 -144 178 -143 299 1 92 31 167 93 236 106 115 256 149 409
92z"/>
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
	const homeIcon = document.querySelector("[data-home-icon]");
	homeIcon.innerHTML = homeIconSvg;
	homeIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
	const profileIcon = document.querySelector("[data-profile-icon]");
	profileIcon.innerHTML = profileIconSvg;
	profileIcon.setAttribute("tabindex", "0");
});

document.addEventListener("DOMContentLoaded", function () {
	const paletteIcon = document.querySelector("[data-palette-icon]");
	paletteIcon.innerHTML = paletteIconSvg;
	paletteIcon.setAttribute("tabindex", "0");
});

// slide le livechat avec focus touche entrer + clic souris

const themes = [
	"whiteTheme",
	"darkTheme",
	"goodForYourEyes",
	"boty",
	"neonBlue",
	"Transcended",
];
  let currentThemeIndex = 0;
  
export function changeTheme(theme)
{
	const body = document.body;
	if (theme)
	{
		body.classList.add(theme);
	}
	else
	{
		themes.forEach((theme) => body.classList.remove(theme));
		currentThemeIndex = (currentThemeIndex + 1) % themes.length;
		body.classList.add(themes[currentThemeIndex]);
		gameVar.currentTheme = themes[currentThemeIndex];
		// console.log("theme changed to: ", themes[currentThemeIndex]);
		// console.log("change theme currentheme:", gameVar.currentTheme);
	}
}

document
	.querySelector("[data-chat-icon]")
	.addEventListener("click", toggleChat);

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

// rend jolie apres avoir cliqué a la souris
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
