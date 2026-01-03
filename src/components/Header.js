import Image from "next/image";
import React from "react";

export default function Header() {
    return (
        <div
            className="fixed left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[420px] h-[var(--header-h)] rounded-[25px]
                 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between px-4 sm:px-5 text-white"
            style={{
                top: "calc(max(env(safe-area-inset-top, 0px), var(--tg-top, 0px)) + 0.5rem)",
            }}
        >
            {/* Left */}
            <div className="flex items-center gap-3">
                <div className="w-[2.563rem] h-[2.563rem] rounded-full bg-white/40" />
                <b className="text-sm sm:text-base">Mhmd.</b>
            </div>

            {/* Center wallet */}
            <div className="px-4 py-1 rounded-full bg-white/10 text-[0.625rem] sm:text-[0.75rem] font-medium">
                0x0d324ff2s...
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <span className="text-[1.1rem] sm:text-[1.25rem] font-medium">0</span>
                <div
                    className="w-[1.9rem] h-[1.9rem] rounded-md bg-cover bg-center"
                    style={{ backgroundImage: "url('/icons/coin.png')" }}
                />
            </div>
        </div>
    );
}
