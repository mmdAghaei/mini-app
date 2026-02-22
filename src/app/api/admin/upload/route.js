import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { cookies } from "next/headers";

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

function extFromMime(mime) {
    const map = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/svg+xml": "svg",
    };
    return map[mime] || "";
}

export async function POST(req) {
    try {
        // 1) فقط ادمین
        const adminCtx = await getCurrentAdmin();
        if (!adminCtx) return bad("unauthorized", 401);

        // 2) CSRF check
        const cookieStore = await cookies();
        const csrfCookie = cookieStore.get(CSRF_COOKIE)?.value || "";
        const csrfHeader = req.headers.get("x-csrf-token") || "";

        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return bad("csrf failed", 403);
        }

        // 3) formData
        const form = await req.formData();
        const file = form.get("file");
        if (!file) return bad("file is required");

        if (!(file instanceof File)) return bad("invalid file");

        // size limit
        const MAX = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX) return bad("file too large (max 5MB)", 413);

        const mime = file.type || "";
        const allowed = new Set([
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
        ]);
        if (!allowed.has(mime)) return bad("unsupported image type");

        const ext = extFromMime(mime);
        if (!ext) return bad("could not determine file extension");

        const bytes = Buffer.from(await file.arrayBuffer());

        const fileName = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const outPath = path.join(uploadDir, fileName);

        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(outPath, bytes, { flag: "wx" });

        const url = `/uploads/${fileName}`;
        return ok({ success: true, url }, 201);
    } catch (e) {
        console.error("upload error:", e);
        return bad(e?.message || "server error", 500);
    }
}