import { NextResponse } from "next/server";
import crypto from "crypto";
import {
    connectMongo,
    User,
    Task,
    TaskCompletion,
    Ledger, // اگر نداری مشکلی نیست؛ فقط import/remove کن
} from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";

const hashToken = (t) =>
    crypto.createHmac("sha256", process.env.SESSION_SECRET).update(t).digest("hex");

const hashEmail = (email) =>
    crypto.createHash("sha256").update(String(email).trim().toLowerCase()).digest("hex");

function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function json(data, status = 200) {
    return NextResponse.json(data, {
        status,
        headers: { "Cache-Control": "no-store" },
    });
}

export async function POST(req) {
    try {
        await connectMongo(process.env.MONGO_URI);

        // 1) auth by session cookie
        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) return json({ success: false, message: "unauthorized" }, 401);

        const user = await User.findOne({ "session.tokenHash": hashToken(token) })
            .select("_id points_balance")
            .lean();

        if (!user) return json({ success: false, message: "unauthorized" }, 401);

        // 2) body
        const body = await req.json();
        const taskId = String(body?.taskId || "").trim();
        const email = String(body?.email || "").trim().toLowerCase();

        if (!taskId) return json({ success: false, message: "taskId missing" }, 400);

        // 3) task
        const task = await Task.findById(taskId).lean();
        if (!task || !task.is_active) {
            return json({ success: false, message: "task not found" }, 404);
        }

        // 4) prevent duplicate (logical check; plus unique index strongly recommended)
        const already = await TaskCompletion.findOne({
            user_id: user._id,
            task_id: task._id,
        })
            .select("_id")
            .lean();

        if (already) {
            return json({ success: false, message: "already completed" }, 409);
        }

        // 5) verify special tasks
        const verifyType = task.verify_type || "simple";

        const proof = {
            verify_type: verifyType,
            email_hash: "",
            external_status: 0,
        };

        if (verifyType === "email_meditechx") {
            if (!email || !isValidEmail(email)) {
                return json({ success: false, message: "valid email is required" }, 400);
            }

            const endpoint = "https://api.meditechx.ca/api/v1/accounts/check-user-exists/";

            let externalRes;
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 8000);

                externalRes = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Api-Key": process.env.MEDITECHX_API_KEY,

                    },
                    body: JSON.stringify({ email }),
                    signal: controller.signal,
                    cache: "no-store",
                }).finally(() => clearTimeout(timer));
            } catch (err) {
                return json({ success: false, message: "verification service unavailable" }, 502);
            }

            proof.external_status = externalRes.status;
            proof.email_hash = hashEmail(email);

            // شرط شما: فقط status 200 => امتیاز بده
            if (externalRes.status !== 200) {
                return json({ success: false, message: "email verification failed" }, 400);
            }
        }

        // 6) create completion (اگر schema قدیمی داری، proof ممکنه ignored بشه)
        let completion;
        try {
            completion = await TaskCompletion.create({
                user_id: user._id,
                task_id: task._id,
                xp_earned: Number(task.xp || 0), // مطابق schema فعلی تو
                proof, // اگر schema اضافه شده باشد ذخیره می‌شود
            });
        } catch (err) {
            // duplicate key fallback (اگر unique index داری)
            if (err?.code === 11000) {
                return json({ success: false, message: "already completed" }, 409);
            }
            throw err;
        }

        // 7) award points
        const updated = await User.findByIdAndUpdate(
            user._id,
            { $inc: { points_balance: Number(task.xp || 0) } },
            { new: true }
        ).select("points_balance");

        // optional ledger
        if (typeof Ledger !== "undefined" && Ledger) {
            try {
                await Ledger.create({
                    user_id: user._id,
                    kind: "points",
                    action: "earn",
                    amount: Number(task.xp || 0),
                    balance_after: Number(updated?.points_balance || 0),
                    ref: {
                        task_id: task._id,
                        task_completion_id: completion?._id,
                    },
                });
            } catch {
                // ledger failure should not break reward
            }
        }

        return json({
            success: true,
            points: Number(updated?.points_balance || 0),
            awarded: Number(task.xp || 0),
        });
    } catch (e) {
        console.error("tasks/complete error:", e);
        return json({ success: false, message: e?.message || "server error" }, 500);
    }
}