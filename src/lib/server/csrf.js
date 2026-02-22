import crypto from "crypto";

export const CSRF_COOKIE = "csrf_token";

export function genCsrfToken() {
    return crypto.randomBytes(32).toString("hex");
}