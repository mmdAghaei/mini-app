"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@/components/UserComponnet";
import { useBalance } from "@/components/BalanceStore";

function shortWallet(addr) {
    if (!addr) return "Connect Wallet";
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Header() {
    const { userData } = useUser();

    const { points = 0, loading, wallet_address } = useBalance();

    const [me, setMe] = useState({
        loading: true,
        wallet_address: null,
        points: 0,
        tokens: 0,
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/me/balance", { method: "GET" });

                const ct = res.headers.get("content-type") || "";
                if (!ct.includes("application/json")) {
                    const text = await res.text();
                    throw new Error(`Non-JSON (${res.status}): ${text.slice(0, 120)}`);
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.message || "Failed");

                if (!cancelled) {
                    setMe({
                        loading: false,
                        wallet_address: json.wallet_address || null,
                        points: Number(json.points || 0),
                        tokens: Number(json.tokens || 0),
                    });
                }
            } catch (e) {
                if (!cancelled) {
                    // اگر لاگین نبود/سشن نبود یا API مشکل داشت، فقط خالی نشون بده
                    setMe((p) => ({ ...p, loading: false }));
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const pointsFormatted = useMemo(
        () => new Intl.NumberFormat("en-US").format(me.points),
        [me.points]
    );

    return (
        <div className="fixed left-1/2 -translate-x-1/2 z-50 top-10 w-[90%] max-w-[420px] h-[var(--header-h)] rounded-[25px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between px-4 sm:px-5 text-white">
            {/* Left */}
            <div className="flex items-center gap-3">
                {userData.photoUrl ? (
                    <img
                        src={userData.photoUrl}
                        alt="User Profile"
                        className="w-[2.563rem] h-[2.563rem] rounded-full"
                    />
                ) : (
                    <div className="w-[2.563rem] h-[2.563rem] rounded-full bg-white/40" />
                )}

                <b className="text-sm sm:text-base">
                    {userData.firstName || userData.username || "Guest"}
                </b>
            </div>

            {/* Center wallet */}
            <div className="px-4 py-1 rounded-full bg-white/10 text-[0.625rem] sm:text-[0.75rem] font-medium">
                {me.loading ? "..." : shortWallet(me.wallet_address)}
            </div>

            {/* Right points (امتیاز داخل بازی) */}
            <div className="flex items-center gap-2">
                <span className="text-[1.1rem] sm:text-[1.25rem] font-medium">
                    {/* {me.loading ? "..." : pointsFormatted}
                     */}

                    {loading ? "..." : points.toLocaleString()}

                </span>
                <div
                    className="w-[1.9rem] h-[1.9rem] rounded-md bg-cover bg-center"
                    style={{ backgroundImage: "url('/icons/coin.png')" }}
                />
            </div>
        </div>
    );
}