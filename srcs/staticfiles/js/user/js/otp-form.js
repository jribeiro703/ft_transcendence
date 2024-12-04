import { fetchData } from "../../utils.js";

export function renderOtpForm(url) {
    const box = document.getElementById('mainContent');
    box.innerHTML += `
        <form id="otpForm">
            <label for="otpCode">OTP Code:</label>
            <input type="text" id="otpCode" name="otpCode" required>
            <button type="submit">Submit</button>
        </form>
    `;

    document.getElementById('otpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        const { data, staus } = await fetchData(url, 'POST', { otp_code: otpCode });
        if (data.access_token) {
            console.log("Get access token successfully")
            localStorage.setItem('access_token', data.access_token);
        }
        box.innerHTML = `<p>${data.message}</p>`;
        window.history.pushState({}, '', '#otpForm');

    });
}