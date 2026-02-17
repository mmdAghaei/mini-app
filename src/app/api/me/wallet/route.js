import { NextResponse } from "next/server";
import crypto from "crypto";
import { ethers } from "ethers";
import { connectMongo, User } from "@/api/Schema/Schemas";

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

        const me = await User.findOne({ "session.tokenHash": hashToken(token) }).select("_id").lean();
        if (!me) return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });

        const { wallet_address } = await req.json();
        const raw = String(wallet_address || "").trim();

        if (!ethers.isAddress(raw)) {
            return NextResponse.json({ success: false, message: "invalid address" }, { status: 400 });
        }

        const addr = ethers.getAddress(raw); // checksum

        // جلوگیری از اینکه یک آدرس برای چند کاربر ثبت بشه
        const exists = await User.findOne({ wallet_address: addr, _id: { $ne: me._id } }).select("_id").lean();
        if (exists) return NextResponse.json({ success: false, message: "wallet already used" }, { status: 409 });

        await User.updateOne({ _id: me._id }, { $set: { wallet_address: addr } });

        return NextResponse.json({ success: true, wallet_address: addr });
    } catch (e) {
        return NextResponse.json({ success: false, message: e?.message || "server error" }, { status: 500 });
    }
}