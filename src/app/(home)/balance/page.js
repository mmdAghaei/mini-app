"use client";

import { useEffect, useState } from "react";

async function getTickerBySymbol(symbol) {
    const res = await fetch("https://api.coinstore.com/api/v1/market/tickers", {
        cache: "no-store",
    });

    const json = await res.json();

    return json.data.find((item) => item.symbol === symbol) || null;
}

async function getTicker24h(symbol) {
    const ticker = await getTickerBySymbol(symbol);
    if (!ticker) return null;

    const open = Number(ticker.open);
    const close = Number(ticker.close);

    const change = close - open;
    const changePercent = ((change / open) * 100).toFixed(2);

    return {
        symbol: ticker.symbol,
        price: close,
        change: change.toFixed(6),
        changePercent,
        isPositive: change >= 0,
    };
}

export default function Balance() {
    // ✅ موجودی کاربر
    const [data, setData] = useState({ loading: true, tokens: 0 });
    const [error, setError] = useState("");

    // ✅ قیمت‌ها (همون کوین‌استور، فقط آوردیم تو state که کلاینتی بشه)
    const [mtxTicker, setMtxTicker] = useState(null);
    const [data_s, setDataS] = useState(null);

    // ✅ موجودی از دیتابیس
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/me/balance", { method: "GET" });

                const ct = res.headers.get("content-type") || "";
                if (!ct.includes("application/json")) {
                    const text = await res.text();
                    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 120)}`);
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.message || "Failed");

                if (!cancelled) setData({ loading: false, tokens: Number(json.tokens || 0) });
            } catch (e) {
                if (!cancelled) {
                    setError(e.message);
                    setData({ loading: false, tokens: 0 });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // ✅ بخش Coinstore رو “منطقش” دست نزدیم؛ فقط اجراش رو آوردیم داخل useEffect
    // چون صفحه client هست و نباید await بالای کامپوننت باشه.
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const t = await getTickerBySymbol("MTXUSDT");
                const s = await getTicker24h("MTXUSDT");
                if (!cancelled) {
                    setMtxTicker(t);
                    setDataS(s);
                }
            } catch (e) {
                // اگر coinstore fail شد، صفحه خراب نشه
                if (!cancelled) {
                    setMtxTicker(null);
                    setDataS(null);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const formatted = new Intl.NumberFormat("en-US").format(data.tokens);

    return (
        <div className="flex h-full flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
            <b className="inline-block text-left text-[0.938rem] sm:text-base md:text-lg font-inter text-darkgray">
                Balance
            </b>

            {/* اگر خطا داشتی */}
            {error ? <div className="text-red-500 mt-2 text-sm">{error}</div> : null}

            <div className="relative flex items-center justify-center">
                <b className="absolute inline-block text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl font-inter font-black text-transparent !bg-clip-text [background:linear-gradient(90deg,_#46dfff,_#fff)]">
                    {data.loading ? "..." : `${formatted} MTX`}
                </b>

                <b className="relative inline-block text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl font-inter font-black text-transparent !bg-clip-text [background:conic-gradient(from_180deg_at_50%_50%,_rgba(11,_7,_27,_0.9)_0deg,_rgba(141,_0,_251,_0.9)_76.88deg,_rgba(144,_175,_255,_0.9)_120deg,_rgba(151,_51,_252,_0.9)_161.25deg,_rgba(130,_91,_255,_0.9)_198.75deg,_rgba(111,_229,_187,_0.9)_236.25deg,_rgba(157,_237,_255,_0.9)_260.62deg,_rgba(11,_7,_27,_0.9)_360deg)] [filter:blur(21.7px)]">
                    {data.loading ? "..." : `${formatted} MTX`}
                </b>
            </div>

            {/* ... بقیه UI تو بدون تغییر ... */}

            <div className=" max-w-[25rem] relative rounded-2xl border border-white/20 bg-white/20 backdrop-blur-xl shadow-xl mt-10">
                <div className="flex items-center mb-4 pl-2 pt-4">
                    <img src="/icons/mtxPageOne.svg" alt="Logo" className="w-8 h-8" />
                    <div className="ml-4">
                        <h2 className="text-[0.875rem] sm:text-base md:text-lg inline-block font-inter text-white">
                            MediTechX
                        </h2>
                        <p className="text-[0.688rem] sm:text-[0.75rem] md:text-base font-inter text-silver">
                            MTX
                        </p>
                    </div>
                </div>

                <div className="text-[1.75rem] sm:text-2xl md:text-3xl font-semibold font-inter text-white text-center inline-block pl-2">
                    {mtxTicker?.close ?? "..."}
                </div>

                <div className="flex justify-between text-sm sm:text-base md:text-lg flex-row gap-1 p-2">
                    <div className="basis-1/3 h-[2rem] relative rounded-[3px] bg-gray-100 flex justify-center items-center p-2">
                        <span className="text-[.9rem] sm:text-[1rem] font-semibold font-inter text-darkgray">24:</span>
                        <span className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium font-inter text-salmon pl-2">
                            {data_s?.changePercent ?? "--"}%
                        </span>
                    </div>

                    <div className="basis-1/3 h-[2rem] relative rounded-[3px] bg-gray-100 flex justify-center items-center p-2">
                        <span className="text-[.9rem] sm:text-[1rem] font-semibold font-inter text-darkgray">High:</span>
                        <span className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium font-inter text-white pl-2">
                            {mtxTicker?.high ?? "--"}
                        </span>
                    </div>

                    <div className="basis-1/3 h-[2rem] relative rounded-[3px] bg-gray-100 flex justify-center items-center p-2">
                        <span className="text-[.9rem] sm:text-[1rem] font-semibold font-inter text-darkgray">Low:</span>
                        <span className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium font-inter text-white pl-3">
                            {mtxTicker?.low ?? "--"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}