import dotenv from "dotenv"
dotenv.config()
import { asyncStore } from '#middlewares/routes-context.js';
import path from "path"
import sgMail from '@sendgrid/mail'
import fs from 'fs/promises'

import { log, LOG_TYPE } from "#lib/logger/logger.js"

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const baseUrl = "https://api.mukhtasar.pro/ui";
export async function sendVerificationMail({ userEmail, userName, verificationToken }: { userEmail: string, userName: string, verificationToken: string }) {
    // 1. Load the template
    const templatePath = path.join(process.cwd(), "templates", "email-verification.html")
    let htmlTemplate = await fs.readFile(templatePath, "utf8")

    // 2. Replace placeholders
    htmlTemplate = htmlTemplate
        .replace(/{{verificationLink}}/g, `${baseUrl}/auth/verify?token=${verificationToken}`)
        .replace(/{{username}}/g, userName)

    // 3. Send with CID attachment
    const msg = {
        to: userEmail,
        from: 'مُختصِر <support@mukhtasar.pro>',
        subject: "تأكيد البريد الإلكتروني - مُختصِر",
        html: htmlTemplate,
        trackingSettings: {
            clickTracking: { enable: false, enableText: false },
            openTracking: { enable: false },
        },
        attachments: [
            {
                content: (await fs.readFile(path.join(process.cwd(), "public", "logo-lg.png"))).toString("base64"), // adjust path
                filename: "logo.png",
                type: "image/png",
                disposition: "inline",
                content_id: "logo_cid", // matches cid in template
            },
        ],
    }

    sgMail
        .send(msg)
        .catch((error) => {
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

    // 3. Send email
    const msg = {
        to: userEmail,
        from: "مُختصِر <support@mukhtasar.pro>",
        subject: "إعادة تعيين كلمة المرور - مُختصِر",
        html: htmlTemplate,
        trackingSettings: {
            clickTracking: { enable: false, enableText: false },
            openTracking: { enable: false },
        },
        attachments: [
            {
                content: (
                    await fs.readFile(
                        path.join(process.cwd(), "public", "logo-lg.png")
                    )
                ).toString("base64"),
                filename: "logo.png",
                type: "image/png",
                disposition: "inline",
                content_id: "logo_cid", // must match the cid in your reset-password.html
            },
        ],
    };

    sgMail
        .send(msg)
        .catch((error) => {
            log(LOG_TYPE.ERROR, { message: "Failed to send reset password mail.", error: error })
        })

    const store = asyncStore.getStore();
    log(LOG_TYPE.INFO, {
        message: "Sent reset password email successfully.",
        requestId: store?.requestId,
        tokenId: store?.tokenId,
    });
}