const { google } = require('googleapis');

async function sendMail({ to, subject, html, text }) {
    try {
        console.log(`Email Service: Attempting to send email to ${to} via Gmail API...`);
        
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: Apna Member <${process.env.GOOGLE_USER}>`,
            `To: ${to}`,
            `Content-Type: text/html; charset=utf-8`,
            `MIME-Version: 1.0`,
            `Subject: ${utf8Subject}`,
            '',
            html || text,
        ];
        const message = messageParts.join('\n');
        
        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log("Email sent successfully via Gmail API! (No Spam)");
    } catch (error) {
        console.error("Gmail API Email Error:", error.message);
        // Don't throw error so the rest of the request can complete
    }
}

console.log("Email Service: Initialized with Gmail API (OAuth2)");

module.exports = { sendMail };
