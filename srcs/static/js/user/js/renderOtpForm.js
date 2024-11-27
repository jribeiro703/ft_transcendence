import { fetchData } from "../../utils.js";
import { renderPage } from "../../historyManager.js"

export function renderOtpForm(url, msg) {
    alert(msg);
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
    window.history.pushState({ page: "otpForm" }, 'OtpForm', '#otpForm');
    
    document.getElementById('otpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        const responseObject = await fetchData(url, 'POST', { otp_code: otpCode });
        
        alert(responseObject.data.message);
        if (responseObject.data.access_token && responseObject.status === 200) {
            console.log("Get access token successfully")
            localStorage.setItem('access_token', responseObject.data.access_token);
            renderPage("user");
        }
    });
}