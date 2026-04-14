import nodemailer from "nodemailer";
import dns from "dns/promises";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;
const smtpSecure = process.env.SMTP_SECURE === "true";

const hasSmtpConfig = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom);

let transporter;

const resolveSmtpHost = async () => {
    if (!smtpHost) {
        return { transportHost: smtpHost, tlsServerName: undefined };
    }

    try {
        const ipv4Addresses = await dns.resolve4(smtpHost);

        if (ipv4Addresses?.length) {
            return {
                transportHost: ipv4Addresses[0],
                tlsServerName: smtpHost
            };
        }
    } catch (error) {
        console.warn(`IPv4 DNS lookup failed for ${smtpHost}: ${error.message}`);
    }

    return {
        transportHost: smtpHost,
        tlsServerName: undefined
    };
};

const getTransporter = async () => {
    if (!hasSmtpConfig) {
        return null;
    }

    if (!transporter) {
        const { transportHost, tlsServerName } = await resolveSmtpHost();

        transporter = nodemailer.createTransport({
            host: transportHost,
            port: smtpPort,
            secure: smtpSecure,
            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 30000,
            ...(tlsServerName
                ? {
                    tls: {
                        servername: tlsServerName
                    }
                }
                : {}),
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });
    }

    return transporter;
};

export const sendVerificationOtpEmail = async ({ email, username, otp }) => {
    const mailer = await getTransporter();

    if (!mailer) {
        console.warn(`SMTP is not configured. OTP for ${email}: ${otp}`);
        return false;
    }

    await mailer.sendMail({
        from: smtpFrom,
        to: email,
        subject: "Verify your DocVault email",
        html: `
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
    });

    return true;
};

export const isSmtpConfigured = () => hasSmtpConfig;
