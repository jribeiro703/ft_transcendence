// import { fetchData } from "./utils.js"

// export function renderProfilePage() {
// 	const box = document.getElementById('auth-box');

// 	const data = await fetchData('https://localhost:8081/user/detail/')
// }


// 3 fetch a faire : username (alias), user stats, match-history

export function renderProfilePage() {
	const box = document.getElementById('profileBox')
	box.innerHTML = `
	<h2>Profile Page</h2>
	`
}