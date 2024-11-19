import { fetchData } from "./utils.js";

export function renderOtpForm(url) {
    const box = document.getElementById('authBox');
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
        const full_url = "https://localhost:8081" + url

        const data = await fetchData(full_url, 'POST', { otp_code: otpCode });
        console.log('OTP verification response:', data);
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = "/";
        }
        box.innerHTML = `<p>${data.message}</p>`;
    });
}