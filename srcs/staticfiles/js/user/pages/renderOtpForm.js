import { fetchData } from "../fetchData.js";
import { showToast } from "../tools.js"
import { renderPage } from "../historyManager.js";

export function renderOtpForm(url, msg) {
    showToast(msg, "success");
    const box = document.getElementById('mainContent');
    box.innerHTML = `
    <div class="custom-form">
        <form id="otpForm">
            <label for="otpCode">OTP Code:</label>
            <input type="text" id="otpCode" name="otpCode" required>
            <button type="submit">Submit</button>
        </form>
    </div>
    `;
	history.pushState({ page: "otpForm" }, 'OtpForm', '#otpForm');
    
    document.getElementById('otpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        const responseObject = await fetchData(url, 'POST', { otp_code: otpCode }, false, "simple");
        
        if (responseObject.status === 200) {
            sessionStorage.setItem('access_token', responseObject.data.access_token);
			renderPage("user");
		} else
            showErrorMessages(responseObject);
    });
}