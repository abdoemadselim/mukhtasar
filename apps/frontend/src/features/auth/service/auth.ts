import { type NewUserType } from "@mukhtasar/shared"
import { type LoginType } from "@mukhtasar/shared"

export async function signup(data: NewUserType) {
    try {
        const res = await fetch(`/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            // To allow the browser to accept the Set-Cookie response header
            credentials: "include"
        })

        if (!res.ok) {
            const { fieldErrors } = await res.json();
            return fieldErrors;
        }

        return {}; // No errors
    } catch (error) {
        return {
            root: { message: "حدث خطأ غير متوقع. حاول مرة أخرى." }
        }
    }
}

export async function login(data: LoginType) {
    try {
        const res = await fetch(`/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            // To allow the browser to accept the Set-Cookie response header
            credentials: "include"
        })

        if (!res.ok) {
            const { fieldErrors, errors } = await res.json();

            if (fieldErrors) {
                return fieldErrors
            }

            if (errors.length) {
                return {
                    root: { message: errors[0] }
                }
            }
        }


    } catch (error) {
        console.error(error)
        return {
            root: { message: "حدث خطأ غير متوقع. تأكد من اتصالك بالإنترنت وحاول مرة أخرى." }
        }
    }
}

export async function logout() {
    try {
        const res = await fetch(`/api/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // Send cookies with the request
            credentials: "include"
        })

        if (!res.ok) {
            throw new Error('Logout failed')
        }

        return { success: true }
    } catch (error) {
        console.error('Logout error:', error)
        return {
            success: false,
            error: "حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى."
        }
    }
}