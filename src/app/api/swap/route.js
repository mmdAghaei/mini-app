import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongo, User, Transaction, Ledger } from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";

function hashToken(token) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(token)
        .digest("hex");
}

export async function POST(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });

        const tokenHash = hashToken(token);

        const me = await User.findOne({ "session.tokenHash": tokenHash }).select("_id points_balance token_balance wallet_address");
        if (!me) return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });

        const body = await req.json();
        const xp = Number(body?.xp);
        const toAddress = String(body?.toAddress || "").trim();

        if (!Number.isFinite(xp) || xp <= 0) {
            return NextResponse.json({ success: false, message: "invalid xp" }, { status: 400 });
        }

        // نرخ تبدیل (مثل quote)
        const rateXpPerMtx = 1000; // 1000 XP = 1 MTX
        const mtxAmount = xp / rateXpPerMtx;

        // حداقل
        if (xp < 1000) return NextResponse.json({ success: false, message: "min is 1000 XP" }, { status: 400 });

        // موجودی کافی؟
        if ((me.points_balance || 0) < xp) {
            return NextResponse.json({ success: false, message: "not enough XP" }, { status: 400 });
        }

        // آدرس مقصد اگر خالی بود، از ولت ذخیره شده استفاده کن
        const finalTo = toAddress || me.wallet_address || "";
        if (!finalTo) {
            return NextResponse.json({ success: false, message: "wallet address required" }, { status: 400 });
        }

        // ✅ اتمیک: کم کردن XP و اضافه کردن MTX
        const updated = await User.findOneAndUpdate(
            { _id: me._id, points_balance: { $gte: xp } },
            { $inc: { points_balance: -xp, token_balance: +mtxAmount } },
            { new: true }
        ).select("points_balance token_balance wallet_address");

        if (!updated) {
            return NextResponse.json({ success: false, message: "balance changed, try again" }, { status: 409 });
        }

        // ثبت تراکنش (اختیاری)
        if (Transaction) {
            await Transaction.create({
                user_id: me._id,
                transaction_type: "swap_xp_to_mtx",
                amount: mtxAmount,
                meta: { xp, rateXpPerMtx, toAddress: finalTo },
            });
        }

        // ثبت در Ledger (اختیاری)
        if (Ledger) {
            await Ledger.create([
                {
                    user_id: me._id,
                    kind: "points",
                    action: "spend",
                    amount: xp,
                    balance_after: Number(updated.points_balance || 0),
                    ref: { type: "swap", toAddress: finalTo },
                },
                {
                    user_id: me._id,
                    kind: "tokens",
                    action: "earn",
                    amount: mtxAmount,
                    balance_after: Number(updated.token_balance || 0),
                    ref: { type: "swap", toAddress: finalTo },
                },
            ]);
        }

        return NextResponse.json({
            success: true,
            points: Number(updated.points_balance || 0),
            tokens: Number(updated.token_balance || 0),
            mtxAmount,
            toAddress: finalTo,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err?.message || "server error" }, { status: 500 });
    }
}