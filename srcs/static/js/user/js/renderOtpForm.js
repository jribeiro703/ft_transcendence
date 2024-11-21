import { fetchData, escapeHTML, DEBUG } from "../../utils.js";

export function renderOtpForm(url, msg) {
    const box = document.getElementById('mainContent');
    box.innerHTML = `
        <p>${msg}</p>
        <br><br>
        <p>Enter your code</p>
        <form id="otpForm">
            <label for="otpCode">OTP Code:</label>
            <input type="text" id="otpCode" name="otpCode" required>
            <button type="submit">Submit</button>
        </form>
    `;

    document.getElementById('otpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        const { data, status } = await fetchData(url, 'POST', { otp_code: otpCode });
        console.log(data, status)
        
        if (data.access_token) {
            console.log("Get access token successfully")
            localStorage.setItem('access_token', data.access_token);
        }
        box.innerHTML = `<p>${escapeHTML(data.message)}</p>`;
        window.history.pushState({ page: "otpForm" }, 'OtpForm', '#otpForm');
    });
}