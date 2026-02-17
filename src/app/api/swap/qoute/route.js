import { NextResponse } from "next/server";

export async function GET() {
    // فعلاً ثابت می‌ذاریم. بعداً می‌تونی از قیمت MTX/USDT یا هرچی خواستی حساب کنی.
    // مثال: هر 1000 XP = 1 MTX
    const rateXpPerMtx = 1000;

    return NextResponse.json({
        success: true,
        rateXpPerMtx,     // XP لازم برای 1 MTX
        minXp: 1000,      // حداقل XP قابل تبدیل
        maxXp: 1000000,   // سقف روزانه/درخواست (دلخواه)
        feePercent: 0,    // اگر کارمزد خواستی
    });
}