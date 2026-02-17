import { NextResponse } from "next/server";
import crypto from "crypto";

// مسیر مدل‌ها طبق ساختار تو:
import { connectMongo, User } from "@/api/Schema/Schemas";
// اگر alias نداری، مسیر نسبی بذار: ../../../../mini-app/src/api/Schema/Schemas

const COOKIE_NAME = "tg_session";

/**
 * ساده و حرفه‌ای: session token رندوم می‌سازیم و داخل خود User نگه می‌داریم.
 * (می‌تونی بعداً جداش کنی به Session collection)
 */

export async function POST(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        const body = await req.json();

        // این‌ها همان فیلدهای Context تو هستند
        const { id, username, firstName, lastName, photoUrl, languageCode } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "telegram id missing" }, { status: 400 });
        }

        // پیدا/ایجاد کاربر
        let user = await User.findOne({ "telegram.id": String(id) });

        const telegramData = {
            id: String(id),
            username: username || "",
            first_name: firstName || "",
            last_name: lastName || "",
            photo_url: photoUrl || "",
            language_code: languageCode || "",
        };

        let isNew = false;

        if (user) {
            user.telegram = { ...user.telegram, ...telegramData };
            user.username = user.username || username || "";
            user.profile_picture = user.profile_picture || photoUrl || "";
        } else {
            isNew = true;
            user = await User.create({
                telegram: telegramData,
                username: username || "",
                profile_picture: photoUrl || "",
            });
        }

        // ساخت session token و ذخیره روی کاربر
        const sessionToken = crypto.randomBytes(32).toString("hex");
        user.session = {
            tokenHash: crypto
                .createHmac("sha256", process.env.SESSION_SECRET)
                .update(sessionToken)
                .digest("hex"),
            createdAt: new Date(),
        };
        await user.save();

        // ست کردن cookie امن
        const res = NextResponse.json({ success: true, isNew });

        res.cookies.set(COOKIE_NAME, sessionToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 روز
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}