import { fetchData } from "./utils.js"

export function renderProfilePage() {
	const box = document.getElementById('auth-box');

	const data = await fetchData('https://localhost:8081/user/detail/')
}