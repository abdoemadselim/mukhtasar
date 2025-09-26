import dotenv from "dotenv"
dotenv.config()
import { asyncStore } from '#middlewares/routes-context.js';
import path from "path"
import fs from 'fs/promises'
import nodemailer from "nodemailer";

import { log, LOG_TYPE } from "#lib/logger/logger.js"
// Create transporter for Hostinger SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com', // Hostinger SMTP server
    port: parseInt(process.env.SMTP_PORT || '587'), // Usually 587 for TLS or 465 for SSL
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your Hostinger email address
        pass: process.env.SMTP_PASSWORD, // Your email password or app password
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates if needed
    }
});

transporter.verify((error) => {
    if (error) {
        log(LOG_TYPE.ERROR, { message: "SMTP connection failed", error });
    } else {
        log(LOG_TYPE.INFO, { message: "SMTP server is ready to send emails" });
    }
});

const baseUrl = "https://api.mukhtasar.pro/ui";
export async function sendVerificationMail({ userEmail, userName, verificationToken }: { userEmail: string, userName: string, verificationToken: string }) {
    // 1. Load the template
    const templatePath = path.join(process.cwd(), "templates", "email-verification.html")
    let htmlTemplate = await fs.readFile(templatePath, "utf8")

    // 2. Replace placeholders
    htmlTemplate = htmlTemplate
        .replace(/{{verificationLink}}/g, `${baseUrl}/auth/verify?token=${verificationToken}`)
        .replace(/{{username}}/g, userName)

    // 3. Prepare email options
    const mailOptions = {
        from: `"مُختصِر" <${process.env.SMTP_FROM}>`,
        to: userEmail,
        subject: "تأكيد البريد الإلكتروني - مُختصِر",
        html: htmlTemplate,
        attachments: [
            {
                filename: "logo.png",
                path: path.join(process.cwd(), "public", "logo-lg.png"),
                cid: "logo_cid", // matches cid in template
            },
        ],
    };

    transporter.sendMail(mailOptions).catch((error) => {
        log(LOG_TYPE.ERROR, { message: "Failed to send email verification mail.", error: error })
    })

    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Sent Email verification successfully.",
        requestId: store?.requestId,
        tokenId: store?.tokenId
    })
}

export async function sendResetMail({
    userEmail,
    userName,
    resetPasswordToken,
}: {
    userEmail: string;
    userName: string;
    resetPasswordToken: string;
}) {
    // 1. Load the reset password template
    const templatePath = path.join(
        process.cwd(),
        "templates",
        "password-reset.html"
    );
    let htmlTemplate = await fs.readFile(templatePath, "utf8");

    const redirectionUrl = process.env.NODE_ENV === "production" ?
        `https://mukhtasar.pro/auth/password-reset-confirm?token=${resetPasswordToken}` :
        `http://localhost:3002/auth/password-reset-confirm?token=${resetPasswordToken}`;

    // 2. Replace placeholders
    htmlTemplate = htmlTemplate
        .replace(/{{resetPasswordLink}}/g, redirectionUrl)
        .replace(/{{username}}/g, userName);

    // 3. Prepare email options
    const mailOptions = {
        from: `"مُختصِر" <${process.env.SMTP_FROM}>`,
        to: userEmail,
        subject: "إعادة تعيين كلمة المرور - مُختصِر",
        html: htmlTemplate,
        attachments: [
            {
                filename: "logo.png",
                path: path.join(process.cwd(), "public", "logo-lg.png"),
                cid: "logo_cid", // matches cid in template
            },
        ],
    };

    // 4. Send email
    transporter.sendMail(mailOptions).catch((error) => {
        log(LOG_TYPE.ERROR, { message: "Failed to send email verification mail.", error: error })
    })

    const store = asyncStore.getStore();
    log(LOG_TYPE.INFO, {
        message: "Sent reset password email successfully.",
        requestId: store?.requestId,
        tokenId: store?.tokenId,
    });
}

export async function sendContactNotificationMail({
    senderName,
    senderEmail,
    message,
}: {
    senderName: string;
    senderEmail: string;
    message: string;
}) {
    // 1. Load the contact notification template
    const templatePath = path.join(
        process.cwd(),
        "templates",
        "contact-notification.html"
    );
    let htmlTemplate = await fs.readFile(templatePath, "utf8");

    // 2. Replace placeholders
    htmlTemplate = htmlTemplate
        .replace(/{{senderName}}/g, senderName)
        .replace(/{{senderEmail}}/g, senderEmail)
        .replace(/{{message}}/g, message.replace(/\n/g, '<br>'));

    // 3. Prepare email options
    const mailOptions = {
        from: `"مُختصِر" <${process.env.SMTP_FROM}>`,
        to: process.env.CONTACT_EMAIL,
        replyTo: senderEmail,
        subject: `رسالة جديدة من ${senderName} - مُختصِر`,
        html: htmlTemplate,
        attachments: [
            {
                filename: "logo.png",
                path: path.join(process.cwd(), "public", "logo-lg.png"),
                cid: "logo_cid", // matches cid in template
            },
        ],
    };

    transporter.sendMail(mailOptions).catch((error) => {
        log(LOG_TYPE.ERROR, { message: "Failed to send email verification mail.", error: error })
    })

    const store = asyncStore.getStore();
    log(LOG_TYPE.INFO, {
        message: "Sent contact notification email successfully.",
        requestId: store?.requestId,
        senderEmail: senderEmail,
    });
}