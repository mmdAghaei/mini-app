import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectMongo, Task } from "@/api/Schema/Schemas";
import { getCurrentAdmin } from "@/lib/server/admin-auth";
import { CSRF_COOKIE } from "@/lib/server/csrf";

export const dynamic = "force-dynamic";

function bad(message, status = 400) {
    return NextResponse.json(
        { success: false, message },
        { status, headers: { "Cache-Control": "no-store" } }
    );
}

function ok(data, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: { "Cache-Control": "no-store" },
    });
}

function clean(v, max = 2000) {
    if (v === undefined || v === null) return "";
    const s = String(v).trim();
    if (!s) return "";
    if (s.length > max) throw new Error("value too long");
    return s;
}

function isSafeRelativePath(v) {
    return typeof v === "string" && v.startsWith("/") && !v.startsWith("//");
}

function isSafeHttpsUrl(v) {
    try {
        const u = new URL(v);
        return u.protocol === "https:";
    } catch {
        return false;
    }
}

function validateUrlLike(v, fieldName) {
    const s = clean(v, 2000);
    if (!s) throw new Error(`${fieldName} is required`);

    const lower = s.toLowerCase();
    if (
        lower.startsWith("javascript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("vbscript:")
    ) {
        throw new Error(`${fieldName} has unsafe scheme`);
    }

    if (isSafeHttpsUrl(s) || isSafeRelativePath(s)) return s;

    if (lower.startsWith("www.")) {
        throw new Error(`${fieldName} must start with https:// or /`);
    }

    throw new Error(`${fieldName} must be /... or https://...`);
}

function validateOptionalAsset(v, fieldName) {
    const s = clean(v, 2000);
    if (!s) return "";
    if (isSafeRelativePath(s) || isSafeHttpsUrl(s)) return s;
    throw new Error(`${fieldName} must be /... or https://...`);
}

function parseBool(v, def = false) {
    if (typeof v === "boolean") return v;
    if (v === undefined || v === null || v === "") return def;
    const s = String(v).toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
    return def;
}

function parseXP(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error("xp must be an integer");
    if (n < 1 || n > 100000) throw new Error("xp out of range");
    return n;
}

export async function POST(req) {
    try {
        const adminCtx = await getCurrentAdmin();
        if (!adminCtx) return bad("unauthorized", 401);

        const cookieStore = await cookies();
        const csrfCookie = cookieStore.get(CSRF_COOKIE)?.value || "";
        const csrfHeader = req.headers.get("x-csrf-token") || "";
        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return bad("csrf failed", 403);
        }

        const body = await req.json();

        await connectMongo(process.env.MONGO_URI);

        const category = clean(body?.category, 80);
        const title = clean(body?.title, 160);
        const link = validateUrlLike(body?.link, "link");
        const xp = parseXP(body?.xp);
        const is_active = parseBool(body?.is_active, true);

        if (!category) throw new Error("category is required");
        if (!title) throw new Error("title is required");

        const icon_type = clean(body?.icon_type, 20) || "preset";
        if (!["preset", "upload"].includes(icon_type)) {
            throw new Error("icon_type is invalid");
        }

        let icon = clean(body?.icon, 20) || "telegram";
        if (!["telegram", "youtube", "x"].includes(icon)) {
            icon = "telegram";
        }

        const icon_image = validateOptionalAsset(body?.icon_image, "icon_image");
        if (icon_type === "upload" && !icon_image) {
            throw new Error("icon_image is required when icon_type=upload");
        }

        const verify_type = clean(body?.verify_type, 30) || "simple";
        if (!["simple", "email_meditechx"].includes(verify_type)) {
            throw new Error("verify_type is invalid");
        }

        const input_label =
            clean(body?.input_label, 120) ||
            (verify_type === "email_meditechx" ? "Enter your email" : "");

        const input_placeholder =
            clean(body?.input_placeholder, 120) ||
            (verify_type === "email_meditechx" ? "you@example.com" : "");

        const created = await Task.create({
            category,
            title,
            xp,
            icon,
            icon_type,
            icon_image,
            link,
            verify_type,
            input_label,
            input_placeholder,
            is_active,
        });

        return ok({ success: true, task: created }, 201);
    } catch (e) {
        console.error("create task error:", e);
        const msg = e?.message || "server error";

        if (
            msg.includes("required") ||
            msg.includes("invalid") ||
            msg.includes("must") ||
            msg.includes("range")
        ) {
            return bad(msg, 400);
        }

        return bad(msg, 500);
    }
}