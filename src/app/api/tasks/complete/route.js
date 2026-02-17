import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongo, User, Task, TaskCompletion } from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";
const hashToken = (t) =>
    crypto.createHmac("sha256", process.env.SESSION_SECRET).update(t).digest("hex");

export async function POST(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const user = await User.findOne({ "session.tokenHash": hashToken(token) }).select("_id points_balance").lean();
        if (!user) return NextResponse.json({ success: false }, { status: 401 });

        const { taskId } = await req.json();
        if (!taskId) return NextResponse.json({ success: false, message: "taskId missing" }, { status: 400 });

        const task = await Task.findById(taskId).lean();
        if (!task || !task.is_active) return NextResponse.json({ success: false, message: "task not found" }, { status: 404 });

        // جلوگیری از دوباره گرفتن امتیاز
        try {
            await TaskCompletion.create({
                user_id: user._id,
                task_id: task._id,
                xp_earned: task.xp,
            });
        } catch {
            return NextResponse.json({ success: false, message: "already completed" }, { status: 409 });
        }

        // امتیاز بده
        const updated = await User.findByIdAndUpdate(
            user._id,
            { $inc: { points_balance: task.xp } },
            { new: true }
        ).select("points_balance");

        return NextResponse.json({
            success: true,
            points: Number(updated?.points_balance || 0),
        });
    } catch (e) {
        return NextResponse.json({ success: false, message: e?.message || "server error" }, { status: 500 });
    }
}