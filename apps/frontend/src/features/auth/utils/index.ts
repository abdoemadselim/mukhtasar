export function getGoogleOAuthURL() {
    const google_auth_server_url = "https://accounts.google.com/o/oauth2/v2/auth"

    const options = {
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL as string,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string,
        response_type: "code",
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ].join(" "),
    }

    const query_params = new URLSearchParams(options)

    return `${google_auth_server_url}?${query_params.toString()}`
}