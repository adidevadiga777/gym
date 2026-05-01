const axios = require("axios");

async function sendMail({ to, subject, html, text }) {
    try {
        console.log(`Email Service: Attempting to send email to ${to} via Resend...`);
        const response = await axios.post(
            "https://api.resend.com/emails",
            {
                from: "onboarding@resend.dev", // You can update this after verifying a domain
                to: [to],
                subject: subject,
                html: html,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Email sent successfully via Resend", response.data);
    } catch (error) {
        console.error("Resend Email Error:", error.response ? error.response.data : error.message);
        // Don't throw error so the rest of the request can complete
    }
}

console.log("Email Service: Initialized with Resend API");

module.exports = { sendMail };
