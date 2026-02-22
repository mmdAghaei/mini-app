import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectMongo, Event } from "@/api/Schema/Schemas";
import { getCurrentAdmin } from "@/lib/server/admin-auth";
import { CSRF_COOKIE } from "@/lib/server/csrf";

export const dynamic = "force-dynamic";
function validateHref(v) {
    const s = cleanOptionalString(v, 2000);
    if (!s) return "";

    // امنیت: هر چیزی که شبیه scheme خطرناک باشه رد
    const lower = s.toLowerCase();
    if (
        lower.startsWith("javascript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("vbscript:")
    ) {
        throw new Error("href contains an unsafe scheme");
    }

    // لینک داخلی
    if (isSafeRelativePath(s)) return s;

    // فقط https خارجی
    if (isSafeHttpsUrl(s)) return s;

    // اگر کاربر www داد، پیام واضح بده
    if (lower.startsWith("www.")) {
        throw new Error("href must start with https:// or /");
    }

    throw new Error("href must be /... or https://...");
}
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

function cleanOptionalString(v, max = 2000) {
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

function validateAssetUrl(v, fieldName) {
    const s = cleanOptionalString(v, 2000);
    if (!s) return "";
    if (isSafeRelativePath(s) || isSafeHttpsUrl(s)) return s;
    throw new Error(`${fieldName} must be /... or https://...`);
}

function parseText(v) {
    const text = String(v ?? "").trim();
    if (!text) throw new Error("text is required");
    if (text.length > 140) throw new Error("text max length is 140");
    return text;
}

function parseBool(v, def = false) {
    if (typeof v === "boolean") return v;
    if (v === undefined || v === null || v === "") return def;
    const s = String(v).toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
    return def;
}

function parseOrder(v) {
    if (v === undefined || v === null || v === "") return 1000;
    const n = Number(v);
    if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error("order must be an integer");
    return n;
}

function parseDateOrNull(v, fieldName) {
    if (v === undefined || v === null || v === "") return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) throw new Error(`${fieldName} is invalid`);
    return d;
}

export async function POST(req) {
    try {
        // 1) admin
        const adminCtx = await getCurrentAdmin();
        if (!adminCtx) return bad("unauthorized", 401);

        // 2) csrf
        const cookieStore = await cookies();
        const csrfCookie = cookieStore.get(CSRF_COOKIE)?.value || "";
        const csrfHeader = req.headers.get("x-csrf-token") || "";
        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return bad("csrf failed", 403);
        }

        // 3) json
        const body = await req.json();

        await connectMongo(process.env.MONGO_URI);

        const text = parseText(body?.text);
        const image = validateAssetUrl(body?.image, "image");
        const logo = validateAssetUrl(body?.logo, "logo");
        const href = validateHref(body?.href);

        const isFullWidth = parseBool(body?.isFullWidth, false);
        const isActive = parseBool(body?.isActive, true);
        const order = parseOrder(body?.order);

        const startsAt = parseDateOrNull(body?.startsAt, "startsAt");
        const endsAt = parseDateOrNull(body?.endsAt, "endsAt");

        if (startsAt && endsAt && startsAt > endsAt) {
            return bad("startsAt must be <= endsAt");
        }

        const created = await Event.create({
            text,
            image,
            logo,
            href,
            isFullWidth,
            isActive,
            order,
            startsAt,
            endsAt,
        });

        return ok({ success: true, event: created }, 201);
    } catch (e) {
        console.error("create event error:", e);
        return bad(e?.message || "server error", 500);
    }
}