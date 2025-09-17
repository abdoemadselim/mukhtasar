import { type NewUserType } from "@mukhtasar/shared"
import { type LoginType } from "@mukhtasar/shared"

export async function signup(data: NewUserType) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
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
        return {
            root: { message: "حدث خطأ غير متوقع. حاول مرة أخرى." }
        }
    }
}

export async function login(data: LoginType) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
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

        window.location.href = '/auth/login'

        return { success: true }
    } catch (error) {
        console.error('Logout error:', error)
        return {
            success: false,
            error: "حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى."
        }
    }
}

export async function requestPasswordReset(email: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset-mail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            }),
        })

        if (!res.ok) {
            const { fieldErrors } = await res.json();
            return fieldErrors;
        }

        return {}; // No errors
    } catch (error) {
        console.error('reset password request error:', error)
        return {
            root: { message: "حدث خطأ غير متوقع. حاول مرة أخرى." }
        }
    }
}

export async function resetPassword({ password, password_confirmation, token }: { password: string, password_confirmation: string, token: string }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                password_confirmation,
                token
            }),
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

        return {}; // No errors
    } catch (error) {
        console.error('reset password error:', error)
        return {
            root: { message: "حدث خطأ غير متوقع. حاول مرة أخرى." }
        }
    }
}
