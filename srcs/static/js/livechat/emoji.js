const emojiPicker = document.querySelector("#emoji-picker");
emojiPicker.addEventListener("emoji-click", (event) => {
	const messageInputDom = document.querySelector("#chat-message-input");
	messageInputDom.value += event.detail.unicode;
	messageInputDom.focus();
});

const emojiButton = document.querySelector("#emojiButton");
const emojiPickerContainer = document.querySelector("#emojiPickerContainer");

function getFocusedWindow() {
	if (!document.querySelector("#chat-log").classList.contains('d-none')) {
		return document.querySelector("#chat-log");
	};
	if (!document.querySelector("#gamechat").classList.contains('d-none')) {
		return document.querySelector("#gamechat");
	};
	if (!document.querySelector("#notificationlist").classList.contains('d-none')) {
		return document.querySelector("#notificationlist");
	};
	if (!document.querySelector("#friendlist").classList.contains('d-none')) {
		return document.querySelector("#friendlist");
	};
	if (!document.querySelector("#onlinelist").classList.contains('d-none')) {
		return document.querySelector("#onlinelist");
	};
	return null;
}

function adjustEmojiPickerHeight() {
	const FocusedWindow = getFocusedWindow();
	if (FocusedWindow) {
		const FocusedWindowHeight = FocusedWindow.clientHeight;
		const emojiPickerHeight = Math.min(FocusedWindowHeight, 250);
		emojiPicker.style.height = `${emojiPickerHeight}px`;
	}
}

function adjustEmojiPickerWidth() {
	const FocusedWindow = getFocusedWindow();
	if (FocusedWindow) {
		const FocusedWindowWidth = FocusedWindow.clientWidth;
		const emojiPickerWidth = Math.min(FocusedWindowWidth, 250);
		emojiPicker.style.height = `${emojiPickerWidth}px`;
	}
}

emojiButton.addEventListener("click", () => {
	adjustEmojiPickerHeight();
	adjustEmojiPickerWidth();
	emojiPickerContainer.style.display =
		emojiPickerContainer.style.display == "block" ? "none" : "block";
});

document.addEventListener("click", (event) => {
	if (
		!emojiPickerContainer.contains(event.target) &&
		!emojiButton.contains(event.target)
	) {
		emojiPickerContainer.style.display = "none";
	}
});

window.addEventListener("resize", () => {
	emojiPickerContainer.style.display = "none";
});

