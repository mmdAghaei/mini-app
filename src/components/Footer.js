"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/balance");
    }

    // تابع برای بررسی اینکه آیا مسیر فعلی همان مسیر لینک است یا نه
    const isActive = (path) => router.pathname === path;

    return (
        <div className="fixed inset-x-0 bottom-6 flex justify-center z-50">
            <nav
                aria-label="Primary"
                className="relative w-[min(420px,92%)] h-[88px] rounded-[28px] px-6 sm:px-8 flex items-end justify-between bg-white/10 backdrop-blur-2xl border border-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.55)] overflow-visible"
            >
                <button
                    onClick={handleClick}
                    aria-label="Center action"
                    className="absolute left-1/2 top-[-34px] -translate-x-1/2 w-[66px] h-[66px] sm:w-[86px] sm:h-[86px] rounded-full flex items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(110,220,255,0.18),rgba(60,140,255,0.10),rgba(30,40,90,0.06))] backdrop-blur-2xl border border-white/14 shadow-[0_18px_55px_rgba(0,0,0,0.60)] ring-4 ring-indigo-500/20 transition-all hover:ring-indigo-500/50 active:ring-indigo-600/70"
                >
                    <div className="w-[44px] h-[44px] sm:w-[54px] sm:h-[54px] rounded-full flex items-center justify-center bg-[linear-gradient(135deg,rgba(120,230,255,1),rgba(95,140,255,1),rgba(160,90,255,1))] shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition-all hover:shadow-lg">
                        <Image src="/icons/balance.svg" width={22} height={22} alt="center" />
                    </div>
                </button>

                <div className="flex gap-6 sm:gap-10 pb-4">
                    <Link href="/event">
                        <div
                            className={`flex flex-col items-center gap-2 text-white/90 transition-all ${isActive("/event") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                }`}
                        >
                            <Image
                                src="/icons/event.svg"
                                width={20}
                                height={20}
                                alt="event"
                                className={`transition-all ${isActive("/event") ? "fill-indigo-500" : "hover:scale-110 active:scale-95"
                                    }`}
                            />
                            <span
                                className={`text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all ${isActive("/event") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                    }`}
                            >
                                EVENT
                            </span>
                        </div>
                    </Link>

                    <Link href="/task">
                        <div
                            className={`flex flex-col items-center gap-2 text-white/90 transition-all ${isActive("/task") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                }`}
                        >
                            <Image
                                src="/icons/task.svg"
                                width={20}
                                height={20}
                                alt="task"
                                className={`transition-all ${isActive("/task") ? "fill-indigo-500" : "hover:scale-110 active:scale-95"
                                    }`}
                            />
                            <span
                                className={`text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all ${isActive("/task") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                    }`}
                            >
                                TASK
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex gap-6 sm:gap-10 pb-4">
                    <Link href="/swap">
                        <div
                            className={`flex flex-col items-center gap-2 text-white/90 transition-all ${isActive("/swap") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                }`}
                        >
                            <Image
                                src="/icons/swap.svg"
                                width={20}
                                height={20}
                                alt="swap"
                                className={`transition-all ${isActive("/swap") ? "fill-indigo-500" : "hover:scale-110 active:scale-95"
                                    }`}
                            />
                            <span
                                className={`text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all ${isActive("/swap") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                    }`}
                            >
                                SWAP
                            </span>
                        </div>
                    </Link>

                    <Link href="/profile">
                        <div
                            className={`flex flex-col items-center gap-2 text-white/90 transition-all ${isActive("/profile") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                }`}
                        >
                            <Image
                                src="/icons/profile.svg"
                                width={20}
                                height={20}
                                alt="profile"
                                className={`transition-all ${isActive("/profile") ? "fill-indigo-500" : "hover:scale-110 active:scale-95"
                                    }`}
                            />
                            <span
                                className={`text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all ${isActive("/profile") ? "text-indigo-500" : "hover:text-indigo-400 active:text-indigo-600"
                                    }`}
                            >
                                PROFILE
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.20))]" />
            </nav>
        </div>
    );
}
