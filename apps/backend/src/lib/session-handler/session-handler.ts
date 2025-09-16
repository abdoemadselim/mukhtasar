type SessionCookieConfig = {
    key: string,
    value: string,
    options: {
        maxAge?: number,
        httpOnly: boolean,
        secure: boolean,
        sameSite: "lax" | "strict" | "none"
        domain: string
    }
}

export function getSecureSessionConfig({ key, value = "", age }: { key: string, value?: string, age?: number }): SessionCookieConfig {
    // httpOnly: so even if a malicious script managed to land on our server, it can't access the cookie
    // secure: so the session is only sent over HTTPS (anyway, the server runs only over HTTPS)
    // sameSite: lax (default value): to prevent CSRF attacks (attackers do something on behalf of users because the user's cookie is sent with the malicious request)
    return {
        key,
        value: value,
        options: {
            maxAge: age,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: ".mukhtasar.pro"
        }
    }
}