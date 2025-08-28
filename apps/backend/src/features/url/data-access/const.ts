const BLOCKED_ALIAS = [
    // app reserved routes
    "pages", "api", "admin", "dashboard", "login", "logout",
    "signup", "register", "user", "profile", "settings",

    // ─── Common web files / infra ───
    "www", "pages", "static", "public", "assets", "images",
    "css", "js", "scripts", "fonts", "uploads", "files",
    "favicon.ico", "robots.txt", "sitemap.xml",

    // brand protection
    "mukhtasar", "mukhtasar.pro",

    // ─── Sensitive / phishing prone ───
    "paypal", "stripe", "checkout", "payment", "billing",
    "bank", "account", "secure", "security", "update",
    "google", "facebook", "apple", "twitter", "github",
    "linkedin", "microsoft", "instagram", "whatsapp",

    // ─── Technical unsafe / confusing ───
    "null", "undefined", "true", "false", "nan",
    "test", "example", "sample", "demo", "default",
    "new", "old", "temp"
];
