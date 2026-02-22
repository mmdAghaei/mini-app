import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const adminCtx = await getCurrentAdmin();

        if (!adminCtx) {
            return NextResponse.json(
                { success: true, isAdmin: false },
                { headers: { "Cache-Control": "no-store" } }
            );
        }

        return NextResponse.json(
            {
                success: true,
                isAdmin: true,
                admin: {
                    telegramId: adminCtx.admin.telegramId,
                    username: adminCtx.admin.username,
                },
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        return NextResponse.json(
            { success: false, isAdmin: false },
            { status: 500 }
        );
    }
}