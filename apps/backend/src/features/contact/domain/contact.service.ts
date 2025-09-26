import { sendContactNotificationMail } from "#lib/email/email.js";

export async function sendContactMessage({ name, email, message }: { name: string, email: string, message: string }) {
    await sendContactNotificationMail({ senderName: name, senderEmail: email, message })
}