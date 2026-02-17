"use client";

import { useEffect } from "react";

export default function TelegramThemeGuard() {
    useEffect(() => {
        const tg = window?.Telegram?.WebApp;
        if (!tg) return;

        try {
            tg.expand?.();

            // رنگ‌های ثابت خودت (تاریک)
            tg.setHeaderColor?.("#000000");
            tg.setBackgroundColor?.("#000000");

            tg.ready?.();
        } catch (e) {
            // ignore
        }
    }, []);

    return null;
}