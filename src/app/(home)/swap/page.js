"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useBalance } from "@/components/BalanceStore";

export default function Swap() {
    const { points = 0, wallet_address, setPoints, refresh } = useBalance();

    const [fromAmount, setFromAmount] = useState("0.00"); // XP
    const [toAmount, setToAmount] = useState("0.00");     // MTX
    const [address, setAddress] = useState("");
    const [rate, setRate] = useState(1000); // XP per 1 MTX
    const [minXp, setMinXp] = useState(1000);
    const [loadingQuote, setLoadingQuote] = useState(true);
    const [swapping, setSwapping] = useState(false);
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");

    const fromBalance = useMemo(() => Number(points || 0), [points]);

    // آدرس پیشفرض = ولت ذخیره شده کاربر
    useEffect(() => {
        setAddress((prev) => prev || wallet_address || "");
    }, [wallet_address]);

    // quote
    useEffect(() => {
        (async () => {
            try {
                setLoadingQuote(true);
                const res = await fetch("/api/swap/quote", { cache: "no-store" });
                const json = await res.json();
                if (json?.success) {
                    setRate(Number(json.rateXpPerMtx || 1000));
                    setMinXp(Number(json.minXp || 1000));
                }
            } catch { }
            setLoadingQuote(false);
        })();
    }, []);

    const setMax = () => setFromAmount(String(fromBalance.toFixed(2)));

    // calc toAmount when fromAmount changes
    useEffect(() => {
        const xp = Number(fromAmount);
        if (!Number.isFinite(xp) || xp <= 0) {
            setToAmount("0.00");
            return;
        }
        const mtx = xp / Number(rate || 1000);
        setToAmount(mtx.toFixed(6));
    }, [fromAmount, rate]);

    const canSwap = (() => {
        const xp = Number(fromAmount);
        if (!Number.isFinite(xp) || xp <= 0) return false;
        if (xp < minXp) return false;
        if (xp > fromBalance) return false;
        if (!String(address || "").trim()) return false;
        return true;
    })();

    const doSwap = async () => {
        setError("");
        setOk("");

        const xp = Number(fromAmount);
        if (!canSwap) return;

        setSwapping(true);
        try {
            const res = await fetch("/api/swap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ xp, toAddress: address }),
            });

            const json = await res.json();
            if (!json?.success) throw new Error(json?.message || "swap failed");

            // آپدیت زنده امتیاز/توکن
            setPoints(json.points);
            await refresh?.();

            setOk(`✅ Swapped ${xp.toLocaleString()} XP → ${Number(json.mtxAmount).toFixed(6)} MTX`);
            setFromAmount("0.00");
        } catch (e) {
            setError(e?.message || "swap failed");
        } finally {
            setSwapping(false);
        }
    };

    return (
        <div
            className="flex h-full flex-col items-center justify-center"
            style={{
                paddingTop: "calc(env(safe-area-inset-top, 0px) + var(--header-top) + var(--header-h) + var(--gap))",
                paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + var(--footer-h) + 24px)",
            }}
        >
            <div
                className="
          w-full max-w-[clamp(20rem,92vw,26rem)]
          rounded-[clamp(1.1rem,2.4vw,1.4rem)]
          bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
          border border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
            >
                <div className="relative px-[clamp(1rem,3vw,2rem)] pt-[clamp(1rem,3vw,2rem)] pb-[clamp(1rem,2.6vw,1.75rem)]">

                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-[clamp(1.05rem,1.3vw,1.25rem)] font-semibold tracking-tight text-white/95">
                            Swap
                        </h1>

                        <div className="text-[0.75rem] text-white/55">
                            {loadingQuote ? "rate: ..." : `1 MTX = ${rate} XP`}
                        </div>
                    </div>

                    {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
                    {ok ? <div className="mt-3 text-sm text-emerald-300">{ok}</div> : null}

                    <div className="mt-[clamp(1rem,2.4vw,1.75rem)] flex items-center justify-between gap-3">
                        <p className="text-[clamp(0.85rem,1vw,0.95rem)] text-white/70">
                            Balance: <span className="text-white/75">{fromBalance.toLocaleString()} MTX XP</span>
                        </p>

                        <button
                            onClick={setMax}
                            className="text-[clamp(0.7rem,0.9vw,0.75rem)] font-semibold tracking-wide px-[clamp(0.6rem,1.4vw,0.75rem)] py-[clamp(0.35rem,0.9vw,0.4rem)] rounded-[clamp(0.5rem,1.2vw,0.6rem)] bg-[#0b2030]/80 border border-white/10 text-white/85 hover:bg-[#0b2030] transition shrink-0"
                        >
                            MAX
                        </button>
                    </div>

                    {/* From */}
                    <div className="mt-[clamp(0.6rem,1.4vw,0.75rem)] rounded-[clamp(1.1rem,2.4vw,1.4rem)] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.08))] px-[clamp(0.9rem,2.2vw,1.25rem)] py-[clamp(0.85rem,2vw,1rem)] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-[clamp(0.55rem,1.4vw,0.75rem)] min-w-0">
                            <Image src="/icons/coin.png" width={30} height={30} alt="Coin" />
                            <span className="text-[clamp(0.9rem,1vw,0.95rem)] font-semibold text-white/92 truncate">MTX XP</span>
                        </div>

                        <input
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            inputMode="decimal"
                            className="min-w-[7.5rem] w-[clamp(7.5rem,28vw,9rem)] bg-transparent text-right text-[clamp(0.9rem,1vw,0.95rem)] font-medium text-white/75 placeholder:text-white/35 outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    {/* To */}
                    <div className="mt-[clamp(1rem,2.4vw,1.5rem)]">
                        <p className="text-[clamp(0.85rem,1vw,0.95rem)] text-white/70">
                            You receive: <span className="text-white/75">{toAmount} MTX</span>
                        </p>
                    </div>

                    <div className="mt-[clamp(0.6rem,1.4vw,0.75rem)] rounded-[clamp(1.1rem,2.4vw,1.4rem)] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.08))] px-[clamp(0.9rem,2.2vw,1.25rem)] py-[clamp(0.85rem,2vw,1rem)] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-[clamp(0.55rem,1.4vw,0.75rem)] min-w-0">
                            <Image src="/icons/mtxPageOne.svg" width={30} height={30} alt="MTX" />
                            <span className="text-[clamp(0.9rem,1vw,0.95rem)] font-semibold text-white/92 truncate">MTX</span>
                        </div>

                        <input
                            value={toAmount}
                            readOnly
                            className="min-w-[7.5rem] w-[clamp(7.5rem,28vw,9rem)] bg-transparent text-right text-[clamp(0.9rem,1vw,0.95rem)] font-medium text-white/55 outline-none"
                        />
                    </div>

                    {/* Address */}
                    <div className="mt-[clamp(1rem,2.4vw,1.5rem)]">
                        <p className="text-[clamp(0.85rem,1vw,0.95rem)] text-white/70">Receiving Wallet Address</p>

                        <div className="mt-[clamp(0.6rem,1.4vw,0.75rem)] rounded-[clamp(1.1rem,2.4vw,1.4rem)] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.08))] px-[clamp(0.9rem,2.2vw,1.25rem)] py-[clamp(0.85rem,2vw,1rem)]">
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-transparent text-center text-[clamp(0.78rem,0.9vw,0.85rem)] text-white/65 placeholder:text-white/35 outline-none truncate"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        disabled={!canSwap || swapping}
                        onClick={doSwap}
                        className={[
                            "mt-[clamp(1.1rem,2.6vw,1.75rem)] w-full rounded-full py-[clamp(0.9rem,2.2vw,1rem)] text-[clamp(1rem,1.15vw,1.05rem)] font-semibold bg-[#0a7bb6] text-white shadow-[0_18px_40px_rgba(10,123,182,0.25)] hover:brightness-110 active:brightness-95 transition",
                            "disabled:opacity-45 disabled:cursor-not-allowed",
                        ].join(" ")}
                    >
                        {swapping ? "Swapping..." : `Swap XP`}
                    </button>

                    <p className="mt-3 text-xs text-white/40 text-center">
                        Min: {minXp.toLocaleString()} XP • Rate: 1 MTX = {rate} XP
                    </p>
                </div>
            </div>
        </div>
    );
}