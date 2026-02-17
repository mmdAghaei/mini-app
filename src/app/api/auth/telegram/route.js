import { NextResponse } from "next/server";
import crypto from "crypto";

// مسیر مدل‌ها طبق ساختار تو:
import { connectMongo, User, Referral, Ledger } from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";
const REFERRAL_REWARD_POINTS = 1000; // امتیاز هر رفرال (هرچی خواستی بذار)

function hashSessionToken(token) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(token)
        .digest("hex");
}

function genReferralCode() {
    // کد کوتاه و یکتا برای لینک معرفی
    return crypto.randomBytes(5).toString("hex"); // 10 char
}

export async function POST(req) {
    try {
        await connectMongo(process.env.MONGO_URI);
        await User.syncIndexes();
        const body = await req.json();

        // refCode از Splash ارسال میشه
        const { id, username, firstName, lastName, photoUrl, languageCode, refCode } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "telegram id missing" },
                { status: 400 }
            );
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

            // کاربر جدید
            user = await User.create({
                telegram: telegramData,
                username: username || "",
                profile_picture: photoUrl || "",
                // balances
                points_balance: 0,
                token_balance: 0,
                // برای اینکه کاربر از همون اول لینک داشته باشه
                referral_code: genReferralCode(),
            });
        }

        // ✅ فقط برای کاربر جدید: ثبت رفرال + امتیاز دادن
        if (isNew && refCode) {
            const code = String(refCode).trim();

            if (code) {
                // referrer را پیدا کن
                const referrer = await User.findOne({ referral_code: code })
                    .select("_id points_balance")
                    .lean();

                // جلوگیری از self referral
                if (referrer && String(referrer._id) !== String(user._id)) {
                    try {
                        // ثبت رفرال (اگر unique index داری تکراری نمیشه)
                        const createdReferral = await Referral.create({
                            referrer_id: referrer._id,
                            referred_id: user._id,
                            points_awarded: REFERRAL_REWARD_POINTS,
                        });

                        // امتیاز دادن به referrer
                        const updatedReferrer = await User.findByIdAndUpdate(
                            referrer._id,
                            { $inc: { points_balance: REFERRAL_REWARD_POINTS } },
                            { new: true }
                        ).select("points_balance");

                        // لاگ (اگر Ledger داری)
                        if (Ledger) {
                            await Ledger.create({
                                user_id: referrer._id,
                                kind: "points",
                                action: "earn",
                                amount: REFERRAL_REWARD_POINTS,
                                balance_after: Number(updatedReferrer?.points_balance || 0),
                                ref: {
                                    referral_id: createdReferral._id,
                                    referred_user_id: user._id,
                                },
                            });
                        }
                    } catch (e) {
                        // اگر duplicate key شد یعنی قبلاً ثبت شده؛ نادیده بگیر
                        // (برای کاربر جدید عملاً نباید پیش بیاد ولی safe)
                    }
                }
            }
        }

        // برای user موجود هم save لازم است (اگر تغییر کرده)
        await user.save();

        // ساخت session token و ذخیره روی کاربر
        const sessionToken = crypto.randomBytes(32).toString("hex");
        user.session = {
            tokenHash: hashSessionToken(sessionToken),
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
        return NextResponse.json(
            { success: false, message: err?.message || "server error" },
            { status: 500 }
        );
    }
}