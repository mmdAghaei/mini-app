import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentAdmin } from "@/lib/server/admin-auth";
import { CSRF_COOKIE, genCsrfToken } from "@/lib/server/csrf";

export const dynamic = "force-dynamic";

function bad(message, status = 400) {
    return NextResponse.json(
        { success: false, message },
        { status, headers: { "Cache-Control": "no-store" } }
    );
}

export async function GET() {
    try {
        const adminCtx = await getCurrentAdmin();
        if (!adminCtx) return bad("unauthorized", 401);

        const cookieStore = await cookies();
        let csrf = cookieStore.get(CSRF_COOKIE)?.value;

        if (!csrf) {
            csrf = genCsrfToken();
            cookieStore.set(CSRF_COOKIE, csrf, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 2, // 2 ساعت
            });
        }

        return NextResponse.json(
            { success: true, csrf },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error(e);
        return bad(e?.message || "server error", 500);
    }
}