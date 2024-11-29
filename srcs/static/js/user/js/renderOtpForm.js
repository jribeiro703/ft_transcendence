import { fetchData } from "../fetchData.js";
import { showToast } from "../tools.js"
import { renderUserPage } from "../../renderUserPage.js";

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
    window.// history.pushState({ page: "otpForm" }, 'OtpForm', '#otpForm');
    
    document.getElementById('otpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        const responseObject = await fetchData(url, 'POST', { otp_code: otpCode });
        
        if (responseObject.data.access_token && responseObject.status === 200) {
            localStorage.setItem('access_token', responseObject.data.access_token);
            // renderUserPage();
            window.location.href = "#user";
        } else
            showToast(responseObject.data.message, "error");
    });
}