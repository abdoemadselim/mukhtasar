import nodemailer, { createTestAccount } from "nodemailer"
import fs from "node:fs/promises"
import path from "node:path"

const emailConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}

type MailType = {
    userEmail: string,
    userName: string,
    token: string,
    type?: string
}

const testAccount = await createTestAccount()
emailConfig.auth.pass = testAccount.pass;
emailConfig.auth.user = testAccount.user;
const transporter = nodemailer.createTransport(emailConfig)

const resetTemplate = await fs.readFile(path.join(process.cwd(), "templates", "password-reset.html"), "utf-8")
const verificationTemplate = await fs.readFile(path.join(process.cwd(), "templates", "email-verification.html"), "utf-8")

export async function sendVerificationMail({ userEmail, userName, token, type = 'verify' }: MailType) {
    const isReset = type === 'reset';
    const link = isReset
        ? `localhost:3000/ui/auth/reset-password?token=${token}`
        : `localhost:3000/ui/auth/verify?token=${token}`

    const mailConfig = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: isReset ? "Reset Your Password" : "Verify Email Address",
        html: (isReset ? resetTemplate : verificationTemplate)
            .replace(/{{link}}/g, link)
            .replace("{{name}}", userName)
    }

    const info = await transporter.sendMail(mailConfig)
    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
}