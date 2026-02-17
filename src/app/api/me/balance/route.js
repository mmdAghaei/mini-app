import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongo, User } from "@/api/Schema/Schemas"; // مسیر رو مطابق پروژه‌ت تنظیم کن

const COOKIE_NAME = "tg_session";

function hashToken(token) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(token)
        .digest("hex");
}

export async function GET(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });
        }

        const tokenHash = hashToken(token);

        const user = await User.findOne({ "session.tokenHash": tokenHash })
            .select("points_balance token_balance username telegram profile_picture wallet_address")
            .lean();

        if (!user) {
            return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            points: user.points_balance ?? 0,
            tokens: user.token_balance ?? 0,
            username: user.username || user.telegram?.username || "",
            profile_picture: user.profile_picture || user.telegram?.photo_url || "",
            wallet_address: user.wallet_address || null,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err?.message || "server error" }, { status: 500 });
    }
}