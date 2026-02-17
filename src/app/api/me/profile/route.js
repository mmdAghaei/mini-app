import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongo, User, Referral } from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";

function hashToken(token) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(token)
        .digest("hex");
}

function genReferralCode() {
    // کوتاه، یکتا، مناسب لینک
    return crypto.randomBytes(5).toString("hex"); // 10 chars
}

export async function GET(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const tokenHash = hashToken(token);

        let user = await User.findOne({ "session.tokenHash": tokenHash })
            .select("username profile_picture wallet_address points_balance token_balance referral_code telegram")
            .lean();

        if (!user) return NextResponse.json({ success: false }, { status: 401 });

        // اگر referral_code نداشت، بساز (با retry ساده برای جلوگیری از تداخل rare)
        if (!user.referral_code) {
            for (let i = 0; i < 5; i++) {
                const code = genReferralCode();
                try {
                    await User.updateOne(
                        { _id: user._id, referral_code: { $in: [null, undefined, ""] } },
                        { $set: { referral_code: code } }
                    );
                    user = await User.findById(user._id)
                        .select("username profile_picture wallet_address points_balance token_balance referral_code telegram")
                        .lean();
                    break;
                } catch (e) {
                    // اگر duplicate شد، دوباره تلاش می‌کنیم
                }
            }
        }

        // لیست رفرال‌ها (دوستانی که این کاربر آورده)
        const referrals = await Referral.find({ referrer_id: user._id })
            .populate("referred_id", "username profile_picture telegram points_balance")
            .sort({ createdAt: -1 })
            .lean();

        const friends = referrals.map((r) => {
            const u = r.referred_id || {};
            const name =
                u.username ||
                u.telegram?.username ||
                u.telegram?.first_name ||
                "Friend";

            const photo =
                u.profile_picture ||
                u.telegram?.photo_url ||
                "";

            return {
                id: String(u._id || r._id),
                name,
                photoUrl: photo,
                coins: Number(u.points_balance || 0), // اگر می‌خوای امتیاز دوست رو نشون بده
                joinedAt: r.createdAt,
            };
        });

        return NextResponse.json({
            success: true,
            me: {
                username: user.username || user.telegram?.username || "",
                photoUrl: user.profile_picture || user.telegram?.photo_url || "",
                firstName: user.telegram?.first_name || "",
                lastName: user.telegram?.last_name || "",
                wallet_address: user.wallet_address || null,
                points: Number(user.points_balance || 0),
                tokens: Number(user.token_balance || 0),
                referral_code: user.referral_code || "",
            },
            friends,
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err?.message || "server error" },
            { status: 500 }
        );
    }
}