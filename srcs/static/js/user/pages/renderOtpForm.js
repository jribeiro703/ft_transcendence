import { fetchData } from "../fetchData.js";
import { showToast, showErrorMessages } from "../tools.js"
import { renderPage } from "../historyManager.js";

export function renderOtpForm(url, msg) {
	showToast(msg, "success");
	const box = document.getElementById('mainContent');
	box.innerHTML = `
	<div id="defaultView" class="d-flex flex-column justify-content-center align-items-center gap-4 h-100">
		<form id="otpForm" class="custom-form">
			<div class="custom-form-group">
				<label class="custom-label" for="otpCode">OTP Code:</label>
				<input class="custom-input" type="text" id="otpCode" name="otpCode" required>
			</div>
			<button class="submit-btn" type="submit">Submit</button>
		</form>
	</div>
	`;
	history.pushState({ page: "otpForm" }, 'OtpForm', '#otpForm');
	
	document.getElementById('otpForm').addEventListener('submit', async (e) => {
		e.preventDefault();
		const otpCode = document.getElementById('otpCode').value;
		const responseObject = await fetchData(url, 'POST', { otp_code: otpCode }, false);
		
		if (responseObject.status === 200) {
			// sessionStorage.setItem('access_token', responseObject.data.access_token);
			localStorage.setItem('access_token', responseObject.data.access_token);
			document.dispatchEvent(new CustomEvent('otpVerificationSuccess', {
				detail: {
					reload_chat: true
				}
			}));
			renderPage("home");
		} else
			showErrorMessages(responseObject);
	});
}
