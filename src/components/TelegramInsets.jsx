'use client';

import { useEffect } from 'react';

export default function TelegramInsets() {
    useEffect(() => {
        const tg = window?.Telegram?.WebApp;
        if (!tg) return;

        const apply = () => {
            const top =
                tg?.contentSafeAreaInset?.top ??
                tg?.safeAreaInset?.top ??
                0;

            const bottom =
                tg?.contentSafeAreaInset?.bottom ??
                tg?.safeAreaInset?.bottom ??
                0;

            document.documentElement.style.setProperty('--tg-top', `${top}px`);
            document.documentElement.style.setProperty('--tg-bottom', `${bottom}px`);
        };

        // بهتره تو مینی‌اپ
        tg.ready?.();
        tg.expand?.();

        apply();

        // طبق داک، این eventها برای safe area هستن
        tg.onEvent?.('contentSafeAreaChanged', apply);
        tg.onEvent?.('safeAreaChanged', apply);

        return () => {
            tg.offEvent?.('contentSafeAreaChanged', apply);
            tg.offEvent?.('safeAreaChanged', apply);
        };
    }, []);

    return null;
}
