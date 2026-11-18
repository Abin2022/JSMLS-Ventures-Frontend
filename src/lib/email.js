
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export async function sendOtpEmail(email, otp, name) {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "JSMLS Ventures - Email Verification OTP",

        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to JSMLS Ventures!</h2>

                <p>Hello ${escapeHtml(name)},</p>

                <p>Your email verification OTP is:</p>

                <h1 style="
                    letter-spacing: 8px;
                    color: #2563eb;
                    font-size: 32px;
                ">
                    ${otp}
                </h1>

                <p>This OTP is valid for 5 minutes.</p>

                <p>
                    Please do not share this OTP with anyone.
                </p>

                <p>Regards,<br>JSMLS Ventures Team</p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });
}
