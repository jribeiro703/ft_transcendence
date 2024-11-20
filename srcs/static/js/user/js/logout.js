import { fetchData } from "../../utils.js";

export function renderLogoutPage() {
	const box = document.getElementById('mainContent');

	document.getElementById('btn-Logout').addEventListener('click', async(e) => {
		e.preventDefault();
		const { data, status } = await fetchData('/user/logout/', 'POST');
		if (status == 205) {
			localStorage.setItem('access_token', data.access_token);
		}
		box.innerHTML = `<p>${data.message}</p>`;
		window.history.pushState({}, '', '#logout');
	});
}