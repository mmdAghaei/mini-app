import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongo, User, Task, TaskCompletion } from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";
const hashToken = (t) =>
    crypto.createHmac("sha256", process.env.SESSION_SECRET).update(t).digest("hex");

export async function GET(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const user = await User.findOne({ "session.tokenHash": hashToken(token) }).select("_id").lean();
        if (!user) return NextResponse.json({ success: false }, { status: 401 });

        const done = await TaskCompletion.find({ user_id: user._id }).select("task_id").lean();
        const doneIds = done.map((d) => d.task_id);

        const tasks = await Task.find({
            is_active: true,
            _id: { $nin: doneIds },
        })
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json({ success: true, tasks });
    } catch (e) {
        return NextResponse.json({ success: false, message: e?.message || "server error" }, { status: 500 });
    }
}