const nodemailer = require("nodemailer");

const transporterConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GOOGLE_USER,
    },
    tls: {
        rejectUnauthorized: false
    }
};

if (process.env.GOOGLE_PASS) {
    transporterConfig.auth.pass = process.env.GOOGLE_PASS;
} else if (process.env.GOOGLE_CLIENT_ID) {
    transporterConfig.auth.type = 'OAuth2';
    transporterConfig.auth.clientId = process.env.GOOGLE_CLIENT_ID;
    transporterConfig.auth.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    transporterConfig.auth.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
}

console.log("Transporter Auth Method:", process.env.GOOGLE_PASS ? "Password" : (process.env.GOOGLE_CLIENT_ID ? "OAuth2" : "None"));

const transporter = nodemailer.createTransport(transporterConfig);

transporter.verify()
    .then(() => { console.log("Email transporter is ready"); })
    .catch((error) => { 
        console.error("Email transporter verification failed!");
        console.error("Error Code:", error.code);
        console.error("Message:", error.message);
        if (error.code === 'EAUTH') {
            console.error("Authentication failed. Please check your GOOGLE_USER and credentials in .env.");
            console.error("If using OAuth2, your tokens may have expired.");
            console.error("If using App Password, ensure GOOGLE_PASS is set correctly.");
        }
    });

async function sendMail({ to, subject, html, text }) {
    const mailOptions = {
        from: `Apna Member <${process.env.GOOGLE_USER}>`,
        to,
        subject,
        html,
        text
    }
    const details = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully", details)
}

module.exports = { sendMail };
