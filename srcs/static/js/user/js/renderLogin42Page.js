import { fetchData } from "../fetchData.js";
import { showToast } from "../tools.js";
import { renderPage } from "../../historyManager.js";

// async function handleAuth42Callback() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
    
// 	console.log("handleAuth42Callback(): code = ", code);

//     if (code) {
// 		const responseObject = await fetchData(`/user/login42/callback/`, "POST", {
// 		    code: code
// 		}, false, "simple");
// 		if (responseObject.status === 200) {
// 			sessionStorage.setItem('access_token', responseObject.data.access_token);
// 			renderPage("home");
// 		} else {
// 			showToast(responseObject.data.message, "error");
// 		}
//     }
// }

// function checkForAuthCode() {
// 	const urlParams = new URLSearchParams(window.location.search);
// 	if (urlParams.has('code')) {
// 	    handleAuth42Callback();
// 	}
// }

async function renderLogin42Page() {

    const responseObject = await fetchData(`/user/login42/auth_url/`, "GET", null, false, "simple");
    if (responseObject.status === 200 && responseObject.data.auth_url) {
		window.location.href = responseObject.data.auth_url;
    } else {
       console.error("renderLogin42Page: failed to get 42 auth url");
	   showToast("Failed to get 42 auth url", "error");
	   renderPage("auth");
    }
}

export { renderLogin42Page, checkForAuthCode };