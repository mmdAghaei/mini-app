import { NextResponse } from "next/server";
import { connectMongo, Event } from "@/api/Schema/Schemas";

export async function GET() {
    try {
        await connectMongo(process.env.MONGO_URI);

        const now = new Date();

        const events = await Event.find({
            isActive: true,
            $and: [
                {
                    $or: [
                        { startsAt: null },
                        { startsAt: { $exists: false } },
                        { startsAt: { $lte: now } },
                    ],
                },
                {
                    $or: [
                        { endsAt: null },
                        { endsAt: { $exists: false } },
                        { endsAt: { $gte: now } },
                    ],
                },
            ],
        })
            .sort({ order: 1, createdAt: -1 })
            .select("text image logo isFullWidth href order") // سبک
            .lean();

        return NextResponse.json(
            { success: true, events },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err?.message || "server error" },
            { status: 500, headers: { "Cache-Control": "no-store" } }
        );
    }
}
