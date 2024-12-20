document.addEventListener('DOMContentLoaded', function () {
	const bubbleButton = document.getElementById('bubbleButton');

	bubbleButton.addEventListener('click', function () {
		document.getElementById('chat-log').classList.remove('d-none');
		document.getElementById('friendlist').classList.add('d-none');
		document.getElementById('onlinelist').classList.add('d-none');
		document.getElementById('notificationlist').classList.add('d-none');
		document.getElementById('gamechat').classList.add('d-none');
	});
});