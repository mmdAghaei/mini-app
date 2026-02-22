import crypto from "crypto";
import { cookies } from "next/headers";
import { connectMongo, User, Admin } from "@/api/Schema/Schemas";

const COOKIE_NAME = "tg_session";

function hashSessionToken(token) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(token)
        .digest("hex");
}

export async function getSessionUser() {
    await connectMongo(process.env.MONGO_URI);

    const cookieStore = await cookies();
    const rawToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!rawToken) return null;

    const tokenHash = hashSessionToken(rawToken);

    const user = await User.findOne({ "session.tokenHash": tokenHash })
        .select("_id username telegram")
        .lean();

    if (!user?.telegram?.id) return null;

    return user;
}

export async function getCurrentAdmin() {
    const user = await getSessionUser();
    if (!user) return null;

    const admin = await Admin.findOne({
        telegramId: String(user.telegram.id),
        isActive: true,
    })
        .select("_id telegramId username isActive note")
        .lean();

    if (!admin) return null;

    return { user, admin };
}