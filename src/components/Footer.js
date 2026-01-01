// components/Footer.tsx
import Image from "next/image";
import React from "react";

export default function Footer() {
    return (
        <div className="fixed inset-x-0 bottom-6 flex justify-center z-50">
            <nav
                aria-label="Primary"
                className="
          relative
          w-[min(420px,92%)]
          h-[88px]
          rounded-[28px]
          px-8
          flex items-end justify-between
 bg-white/10
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_18px_55px_rgba(0,0,0,0.55)]
          overflow-visible
        "
            >
                {/* Center floating action */}
                <button
                    aria-label="Center action"
                    className="
            absolute
            left-1/2 top-[-34px]
            -translate-x-1/2
            w-[86px] h-[86px]
            rounded-full
            flex items-center justify-center

            bg-[radial-gradient(circle_at_30%_25%,rgba(110,220,255,0.18),rgba(60,140,255,0.10),rgba(30,40,90,0.06))]
            backdrop-blur-2xl
            border border-white/14
            shadow-[0_18px_55px_rgba(0,0,0,0.60)]
            ring-4 ring-indigo-500/20
          "
                >
                    <div
                        className="
              w-[54px] h-[54px]
              rounded-full
              flex items-center justify-center
              bg-[linear-gradient(135deg,rgba(120,230,255,1),rgba(95,140,255,1),rgba(160,90,255,1))]
              shadow-[0_10px_26px_rgba(0,0,0,0.35)]
            "
                    >
                        <Image src="/icons/balance.svg" width={22} height={22} alt="center" />
                    </div>
                </button>

                {/* Left group */}
                <div className="flex gap-10 pb-4">
                    <button className="flex flex-col items-center gap-2 text-white/90">
                        <Image src="/icons/event.svg" width={20} height={20} alt="event" />
                        <span className="text-[11px] font-semibold tracking-wide">EVENT</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 text-white/90">
                        <Image src="/icons/task.svg" width={20} height={20} alt="task" />
                        <span className="text-[11px] font-semibold tracking-wide">TASK</span>
                    </button>
                </div>

                {/* Right group */}
                <div className="flex gap-10 pb-4">
                    <button className="flex flex-col items-center gap-2 text-white/90">
                        <Image src="/icons/swap.svg" width={20} height={20} alt="swap" />
                        <span className="text-[11px] font-semibold tracking-wide">SWAP</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 text-white/90">
                        <Image src="/icons/profile.svg" width={20} height={20} alt="profile" />
                        <span className="text-[11px] font-semibold tracking-wide">PROFILE</span>
                    </button>
                </div>

                {/* subtle bottom vignette */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.20))]" />
            </nav>
        </div>
    );
}
