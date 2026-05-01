async function sendMail({ to, subject, html, text }) {
    try {
        console.log(`Email Service: Attempting to send email to ${to} via SendGrid...`);
        
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: to }],
                    subject: subject
                }],
                from: { 
                    email: process.env.GOOGLE_USER, // This MUST match your verified SendGrid email
                    name: "Apna Member" 
                },
                content: [{
                    type: "text/html",
                    value: html || text
                }]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`SendGrid API failed with status ${response.status}: ${errorText}`);
        }

        console.log("Email sent successfully via SendGrid!");
    } catch (error) {
        console.error("SendGrid Email Error:", error.message);
        // Don't throw error so the rest of the request can complete
    }
}

console.log("Email Service: Initialized with SendGrid API");

module.exports = { sendMail };
