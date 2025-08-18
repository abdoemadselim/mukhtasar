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
    token: string
}

export async function sendVerificationMail({ userEmail, userName, token }: MailType) {
    const testAccount = await createTestAccount()
    emailConfig.auth.pass = testAccount.pass;
    emailConfig.auth.user = testAccount.user;

    const transporter = nodemailer.createTransport(emailConfig)
    const template = await fs.readFile(path.join(process.cwd(), "templates", "email-verification.html"), "utf-8")
    const verificationLink = `localhost:3000/auth/verify?token=${token}`

    const mailConfig = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Verify Email Address",
        html: template
            .replace(/{{verificationLink}}/g, verificationLink)
            .replace("{{name}}", userName)
    }

    const info = await transporter.sendMail(mailConfig)
    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
}