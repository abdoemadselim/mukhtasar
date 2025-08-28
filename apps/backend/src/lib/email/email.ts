import dotenv from "dotenv"
dotenv.config()
import { asyncStore } from "#root/main.js";
import path from "path"
import sgMail from '@sendgrid/mail'
import fs from 'fs/promises'

import { log, LOG_TYPE } from "#lib/logger/logger.js"

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const baseUrl = "http://localhost:3000/ui";
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

    await sgMail.send(msg);
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Sent Email verification successfully.",
        requestId: store?.requestId,
        tokenId: store?.tokenId
    })
}