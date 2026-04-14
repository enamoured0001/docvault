const brevoApiKey = process.env.BREVO_API_KEY;
const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
const brevoSenderName = process.env.BREVO_SENDER_NAME || "DocVault";

const hasBrevoConfig = Boolean(brevoApiKey && brevoSenderEmail);

export const sendVerificationOtpEmail = async ({ email, username, otp }) => {
    if (!hasBrevoConfig) {
        return false;
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": brevoApiKey
        },
        body: JSON.stringify({
            sender: {
                email: brevoSenderEmail,
                name: brevoSenderName
            },
            to: [
                {
                    email,
                    name: username
                }
            ],
            subject: "Verify your DocVault email",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
                    <h2 style="margin-bottom: 12px;">Verify your email</h2>
                    <p>Hello ${username},</p>
                    <p>Your DocVault verification code is:</p>
                    <div style="margin: 20px 0; font-size: 28px; font-weight: 700; letter-spacing: 8px;">
                        ${otp}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not create this account, you can ignore this email.</p>
                </div>
            `
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API error: ${errorText}`);
    }

    return true;
};

export const isSmtpConfigured = () => hasBrevoConfig;
