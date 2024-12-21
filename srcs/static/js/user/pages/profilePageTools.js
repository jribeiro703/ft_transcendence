import { showErrorMessages } from "../tools.js";
import { fetchAuthData } from "../fetchData.js";
import { renderProfilePage } from "./renderProfilePage.js";

// for searching userand get user public data from clicking on match history avatar
async function GetUserPublicData(username) {
	const responseObject = await fetchAuthData(`/user/search/${username}`, "GET", null, false);
	if (responseObject.status !== 200) {
		showErrorMessages(responseObject);
		return null;
	}

console.log("getUserPublicData: ", responseObject.data);

	return responseObject.data;
}

// get self username and use it to get self profile
async function getSelfUsername() {
	const responseObject = await fetchAuthData(`/user/self-username/`, "GET", null, false);
	if (responseObject.status !== 200) {
		showErrorMessages(responseObject);
		return null;
	}

// console.log("getSelfUsername: ", responseObject.data);;

	return responseObject.data.username;
}

async function renderSelfProfilePage() {
	const username = await getSelfUsername();
	if (username)
		renderProfilePage(username);
	else {
		showErrorMessages("Failed to get self profile page.");
	}
}

export {  GetUserPublicData, getSelfUsername, renderSelfProfilePage };