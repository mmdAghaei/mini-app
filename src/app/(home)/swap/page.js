'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function Swap() {
    const [fromAmount, setFromAmount] = useState('0.00');
    const [toAmount, setToAmount] = useState('0.00');
    const [address, setAddress] = useState('0xfs3432ri3j32idaejri32r29r322');

    const fromBalance = useMemo(() => 100, []);
    const toBalance = useMemo(() => 100, []);

    const setMax = () => setFromAmount(fromBalance.toFixed(2));

    return (
        <div className='flex justify-center items-center min-h-screen'>

            <div
                className="
              
        w-full
        max-w-[clamp(20rem,92vw,26rem)]
        rounded-[clamp(1.1rem,2.4vw,1.4rem)]
        bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
        border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        overflow-hidden
      "
            >
                <div className="relative px-[clamp(1rem,3vw,2rem)] pt-[clamp(1rem,3vw,2rem)] pb-[clamp(1rem,2.6vw,1.75rem)]">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-[clamp(1.05rem,1.3vw,1.25rem)] font-semibold tracking-tight text-white/95">
                            Swap
                        </h1>

                        <button
                            className="
              h-[clamp(2.3rem,4.5vw,2.5rem)] w-[clamp(2.3rem,4.5vw,2.5rem)]
              rounded-full
              border border-white/10
              bg-white/5
              flex items-center justify-center
              shadow-[0_10px_24px_rgba(0,0,0,0.35)]
              hover:bg-white/8 transition
              shrink-0
            "
                            aria-label="Swap direction"
                        >
                            <svg
                                className="w-[clamp(1rem,2.2vw,1.125rem)] h-[clamp(1rem,2.2vw,1.125rem)]"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M7 7h10m0 0-2-2m2 2-2 2"
                                    stroke="rgba(255,255,255,0.9)"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M17 17H7m0 0 2 2m-2-2 2-2"
                                    stroke="rgba(255,255,255,0.9)"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Section 1 label */}
                    <div className="mt-[clamp(1rem,2.4vw,1.75rem)] flex items-center justify-between gap-3">
                        <p className="text-[clamp(0.85rem,1vw,0.95rem)] text-white/70">
                            Balance: <span className="text-white/75">{fromBalance} MTX XP</span>
                        </p>

                        <button
                            onClick={setMax}
                            className="
              text-[clamp(0.7rem,0.9vw,0.75rem)] font-semibold tracking-wide
              px-[clamp(0.6rem,1.4vw,0.75rem)] py-[clamp(0.35rem,0.9vw,0.4rem)]
              rounded-[clamp(0.5rem,1.2vw,0.6rem)]
              bg-[#0b2030]/80
              border border-white/10
              text-white/85
              hover:bg-[#0b2030] transition
              shrink-0
            "
                        >
                            MAX
                        </button>
                    </div>

                    {/* From box */}
                    <div
                        className="
            mt-[clamp(0.6rem,1.4vw,0.75rem)]
            rounded-[clamp(1.1rem,2.4vw,1.4rem)]
            border border-white/10
            bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.08))]
            px-[clamp(0.9rem,2.2vw,1.25rem)] py-[clamp(0.85rem,2vw,1rem)]
            flex items-center justify-between gap-3
          "
                    >
                        <div className="flex items-center gap-[clamp(0.55rem,1.4vw,0.75rem)] min-w-0">
                            <Image
                                src="/icons/coin.png"
                                width={30}
                                height={30}
                                sizes="(max-width: 640px) 24px, 30px"
                                alt="Coin"
                                className="w-[clamp(1.45rem,3vw,1.875rem)] h-[clamp(1.45rem,3vw,1.875rem)]"
                            />
                            <span className="text-[clamp(0.9rem,1vw,0.95rem)] font-semibold text-white/92 truncate">
                                MTX XP
                            </span>
                        </div>

                        <input
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            inputMode="decimal"
                            className="
              min-w-[7.5rem] w-[clamp(7.5rem,28vw,9rem)]
              bg-transparent text-right
              text-[clamp(0.9rem,1vw,0.95rem)] font-medium
              text-white/75 placeholder:text-white/35
              outline-none
            "
                            placeholder="0.00"
                        />
                    </div>

                    {/* Divider line */}
                    <div className="relative mt-[clamp(1.3rem,3vw,2.5rem)]">
                        <div className="h-px w-full bg-white/10" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div
                                className="
                h-[clamp(2.3rem,4.5vw,2.5rem)] w-[clamp(2.3rem,4.5vw,2.5rem)]
                rounded-full
                bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]
                border border-white/10
                shadow-[0_12px_26px_rgba(0,0,0,0.55)]
                flex items-center justify-center
              "
                            >
                                <svg
                                    className="w-[clamp(1rem,2.2vw,1.125rem)] h-[clamp(1rem,2.2vw,1.125rem)]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M12 5v12"
                                        stroke="rgba(255,255,255,0.88)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M7 14l5 5 5-5"
                                        stroke="rgba(255,255,255,0.88)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 label */}
                    <div className="mt-[clamp(0.9rem,2.2vw,1.25rem)]">
                        <p className="text-[clamp(0.85rem,1vw,0.95rem)] text-white/70">
                            Balance: <span className="text-white/75">{toBalance} MTX</span>
                        </p>
                    </div>

                    {/* To box */}
                    <div
                        className="
            mt-[clamp(0.6rem,1.4vw,0.75rem)]
            rounded-[clamp(1.1rem,2.4vw,1.4rem)]
            border border-white/10
            bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.08))]
            px-[clamp(0.9rem,2.2vw,1.25rem)] py-[clamp(0.85rem,2vw,1rem)]
            flex items-center justify-between gap-3
          "
                    >
                        <div className="flex items-center gap-[clamp(0.55rem,1.4vw,0.75rem)] min-w-0">
                            <Image
                                src="/icons/mtxPageOne.svg"
                                width={30}
                                height={30}
                                sizes="(max-width: 640px) 24px, 30px"
                                alt="MTX"
                                className="w-[clamp(1.45rem,3vw,1.875rem)] h-[clamp(1.45rem,3vw,1.875rem)]"
                            />
                            <span className="text-[clamp(0.9rem,1vw,0.95rem)] font-semibold text-white/92 truncate">
                                MTX
                            </span>
                        </div>

                        <input
                            value={toAmount}
                            onChange={(e) => setToAmount(e.target.value)}
                            inputMode="decimal"
                            className="
              min-w-[7.5rem] w-[clamp(7.5rem,28vw,9rem)]
              bg-transparent text-right
              text-[clamp(0.9rem,1vw,0.95rem)] font-medium
              text-white/75 placeholder:text-white/35
              outline-none
            "
                            placeholder="0.00"
                        />
                    </div>

                    {/* Receiving Address */}
                    <div className="mt-[clamp(1rem,2.4vw,1.5rem)]">
                        <p className="text-[clamp(0.85rem,1vw,0.95rem)] text-white/70">
                            Reciving Wallet Address
                        </p>

                        <div
                            className="
              mt-[clamp(0.6rem,1.4vw,0.75rem)]
              rounded-[clamp(1.1rem,2.4vw,1.4rem)]
              border border-white/10
              bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.08))]
              px-[clamp(0.9rem,2.2vw,1.25rem)] py-[clamp(0.85rem,2vw,1rem)]
            "
                        >
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="
                w-full bg-transparent
                text-center
                text-[clamp(0.78rem,0.9vw,0.85rem)]
                text-white/65 placeholder:text-white/35
                outline-none
                truncate
              "
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        className="
            mt-[clamp(1.1rem,2.6vw,1.75rem)] w-full
            rounded-full
            py-[clamp(0.9rem,2.2vw,1rem)]
            text-[clamp(1rem,1.15vw,1.05rem)] font-semibold
            bg-[#0a7bb6]
            text-white
            shadow-[0_18px_40px_rgba(10,123,182,0.25)]
            hover:brightness-110 active:brightness-95 transition
          "
                    >
                        Swap XP
                    </button>
                </div>
            </div>
        </div>
    );
}
