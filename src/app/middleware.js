import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // فقط صفحه اسپلش را کنترل کن
    if (pathname !== "/") return NextResponse.next();

    const session = req.cookies.get("tg_session")?.value;

    // اگر سشن داشت، اسپلش ممنوع => به balance
    if (session) {
        const url = req.nextUrl.clone();
        url.pathname = "/balance";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};