async function sendMail({ to, subject, html, text }) {
    try {
        console.log(`Email Service: Attempting to send email to ${to} via Resend...`);
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "onboarding@resend.dev", // You can update this after verifying a domain
                to: [to],
                subject: subject,
                html: html,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Resend API failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Email sent successfully via Resend", data);
    } catch (error) {
        console.error("Resend Email Error:", error.message);
        // Don't throw error so the rest of the request can complete
    }
}

console.log("Email Service: Initialized with Resend API");

module.exports = { sendMail };
