import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_PREFIXES = ["/pages", "/auth", "/dashboard", "/_next", "/api", "/ui", "/public"];
const ALIAS = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{0,28}[a-zA-Z0-9])?$/;

function isFrontendPath(pathname: string) {
    if (pathname === "/") return true;
    return RESERVED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// Short links used to be resolved by the Cloudflare worker. This does the same hop
// when the Next server is the public edge: look the alias up and redirect.
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (isFrontendPath(pathname) || pathname.includes(".")) {
        return NextResponse.next();
    }

    const alias = pathname.slice(1);
    if (!alias || alias.includes("/") || !ALIAS.test(alias)) {
        return NextResponse.next();
    }

    const domain = process.env.SHORT_DOMAIN;
    const api = process.env.API_URL;
    if (!domain || !api) {
        return NextResponse.next();
    }

    try {
        const backendRes = await fetch(
            `${api}/public/url/redirect/${encodeURIComponent(domain)}/${encodeURIComponent(alias)}`,
            {
                redirect: "manual",
                headers: {
                    "user-agent": request.headers.get("user-agent") ?? "",
                    "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
                    referer: request.headers.get("referer") ?? "",
                },
            }
        );
        const location = backendRes.headers.get("location");
        if (location && backendRes.status >= 300 && backendRes.status < 400) {
            return NextResponse.redirect(location, 302);
        }
    } catch {
        return NextResponse.redirect(new URL("/pages/error", request.url));
    }

    return NextResponse.redirect(new URL("/pages/error", request.url));
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)",
    ],
};
