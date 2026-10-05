type SessionCookieConfig = {
    key: string,
    value: string,
    options: {
        maxAge?: number,
        httpOnly: boolean,
        secure: boolean,
        sameSite: "lax" | "strict" | "none"
        domain?: string
    }
}

export function getSecureSessionConfig({ key, value = "", age }: { key: string, value?: string, age?: number }): SessionCookieConfig {
    // httpOnly: so even if a malicious script managed to land on our server, it can't access the cookie
    // secure: so the session is only sent over HTTPS. COOKIE_SECURE overrides this for HTTP deploys.
    // sameSite: lax (default value): to prevent CSRF attacks (attackers do something on behalf of users because the user's cookie is sent with the malicious request)
    const secure = process.env.COOKIE_SECURE !== undefined
        ? process.env.COOKIE_SECURE === "true"
        : process.env.NODE_ENV === "production";

    // Empty COOKIE_DOMAIN keeps a host-only cookie, which works for an IP address.
    // Unset COOKIE_DOMAIN keeps the historical localhost / .mukhtasar.pro split.
    const domain = process.env.COOKIE_DOMAIN !== undefined
        ? process.env.COOKIE_DOMAIN || undefined
        : process.env.NODE_ENV === "production" ? ".mukhtasar.pro" : "localhost";

    return {
        key,
        value: value,
        options: {
            maxAge: age,
            httpOnly: true,
            secure,
            sameSite: "lax",
            ...(domain ? { domain } : {}),
        }
    }
}