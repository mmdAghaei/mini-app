"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useUser } from "@/components/UserComponnet";
const BalanceContext = createContext(null);
export const useBalance = () => useContext(BalanceContext);

export function BalanceProvider({ children }) {
    const { userData } = useUser();
    const tgId = userData?.id ? String(userData.id) : "";
    const [state, setState] = useState({
        loading: true,
        points: 0,
        tokens: 0,
        wallet_address: null,
    });


    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/me/balance", {
                method: "GET",
                cache: "no-store",
                headers: { "Cache-Control": "no-store" },
            });

            // اگر سشن نداشت یا 401 شد، وضعیت قبلی رو نگه دار
            if (!res.ok) {
                setState((p) => ({ ...p, loading: false }));
                return;
            }

            const ct = res.headers.get("content-type") || "";
            if (!ct.includes("application/json")) {
                setState((p) => ({ ...p, loading: false }));
                return;
            }

            const json = await res.json();
            if (!json?.success) {
                setState((p) => ({ ...p, loading: false }));
                return;
            }

            // ✅ بسیار مهم: با هر اسم فیلدی که بیاد، points رو درست بخون
            const points =
                Number(json.points ?? json.total_points ?? json.points_balance ?? 0);

            const tokens =
                Number(json.tokens ?? json.token_balance ?? 0);

            setState({
                loading: false,
                points,
                tokens,
                wallet_address: json.wallet_address || null,
            });
        } catch {
            setState((p) => ({ ...p, loading: false }));
        }
    }, []);

    useEffect(() => {
        refresh();
        const id = setInterval(refresh, 5000); // زنده
        return () => clearInterval(id);
    }, [refresh]);

    const setPoints = (points) =>
        setState((p) => ({ ...p, points: Number(points ?? 0) }));

    return (
        <BalanceContext.Provider value={{ ...state, refresh, setPoints }}>
            {children}
        </BalanceContext.Provider>
    );
}