'use client';

import { useUser } from "@/components/UserComponnet";
import Image from "next/image";
export default function Profile() {
    const { userData } = useUser();
    const friends = [
        { id: "1", name: "Mmd", coins: 7723 },
        { id: "2", name: "Mmd", coins: 7723 },
        { id: "3", name: "Mmd", coins: 7723 },
        { id: "4", name: "Mmd", coins: 7723 },
    ];

    return (
        <div className="w-full flex justify-center items-center min-h-screen px-4 sm:px-6">
            <div className="relative w-full max-w-[clamp(20rem,92vw,28rem)] rounded-[clamp(1rem,2.6vw,1.25rem)] border border-white/15 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(213,255,123,0.14),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden">
                {/* subtle glow */}
                <div className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(200px_120px_at_50%_0%,black,transparent)] bg-[linear-gradient(90deg,rgba(213,255,123,0.22),rgba(246,250,0,0.12),rgba(10,123,182,0.12))]" />

                <div className="relative p-[clamp(1rem,3vw,1.5rem)] flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative">
                        {userData.photoUrl ? (
                            <img src={userData.photoUrl} alt="User Profile" className="h-[clamp(4rem,10vw,5rem)] w-[clamp(4rem,10vw,5rem)] rounded-full border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
                        ) : (
                            <div className="h-[clamp(4rem,10vw,5rem)] w-[clamp(4rem,10vw,5rem)] rounded-full bg-white/10 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
                        )}
                        <div className="absolute -inset-1 rounded-full blur-xl bg-[radial-gradient(circle,rgba(213,255,123,0.25),transparent_60%)]" />
                    </div>

                    {/* Name */}
                    <b className="mt-[clamp(0.6rem,1.6vw,0.8rem)] text-[clamp(1.35rem,2.2vw,1.7rem)] font-extrabold tracking-tight text-white/95">
                        {userData.firstName}
                    </b>
                    <p className="mt-1 text-[clamp(0.82rem,1vw,0.92rem)] text-white/55">Your XP & friends leaderboard</p>

                    {/* Coins */}
                    <div className="mt-[clamp(1rem,2.6vw,1.25rem)] flex items-center gap-[clamp(0.6rem,1.8vw,0.9rem)]">
                        <Image src={"/icons/coin.png"} width={58} height={58} sizes="(max-width:640px) 44px, 58px" alt="Coin" className="w-[clamp(2.6rem,7vw,3.6rem)] h-[clamp(2.6rem,7vw,3.6rem)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" />
                        <div className="text-[clamp(1.6rem,3vw,2.2rem)] relative font-semibold font-inter text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d5ff7b,_#f6fa00)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-left inline-block">15,000</div>
                    </div>

                    {/* Actions */}
                    <div className="mt-[clamp(1rem,2.6vw,1.25rem)] w-full flex items-center gap-3">
                        <button className="flex-1 h-[clamp(2.8rem,6.5vw,3.1rem)] rounded-[clamp(0.75rem,1.8vw,0.95rem)] bg-[linear-gradient(90deg,#d5ff7b,#f6fa00)] text-black font-extrabold text-[clamp(0.95rem,1.2vw,1.05rem)] shadow-[0_18px_40px_rgba(213,255,123,0.18)] hover:brightness-105 active:brightness-95 active:scale-[0.99] transition">
                            Invite Friends
                        </button>

                        <button aria-label="More" className="shrink-0 h-[clamp(2.8rem,6.5vw,3.1rem)] w-[clamp(2.8rem,6.5vw,3.1rem)] rounded-[clamp(0.75rem,1.8vw,0.95rem)] bg-white/8 border border-white/12 shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:bg-white/12 transition flex items-center justify-center">
                            <span className="text-white/75 text-[clamp(1.1rem,1.8vw,1.25rem)]">⋯</span>
                        </button>
                    </div>

                    {/* Friends list */}
                    <div className="mt-[clamp(1rem,2.6vw,1.25rem)] w-full border border-white/10 bg-white/6 overflow-hidden">
                        <div className="sticky top-0 z-10 px-4 py-3 bg-[linear-gradient(180deg,rgba(2,6,23,0.85),rgba(2,6,23,0.55))] backdrop-blur border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-[clamp(0.9rem,1.05vw,1rem)] font-semibold text-white/85">Friends</p>
                                <p className="text-[clamp(0.78rem,0.95vw,0.9rem)] text-white/50">{friends.length} total</p>
                            </div>
                        </div>

                        <div className="max-h-[clamp(16rem,40vh,22rem)] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.18)_transparent]">
                            {friends.map((f, idx) => (
                                <FriendRow key={f.id} friend={f} isLast={idx === friends.length - 1} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function FriendRow({ friend, isLast }) {
    return (
        <div
            className={[
                "px-4 py-3 flex items-center justify-between gap-3",
                "hover:bg-white/5 transition",
                !isLast ? "border-b border-white/10" : "",
            ].join(" ")}
        >
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-white/10 border border-white/12" />
                    <div className="absolute -inset-1 rounded-full blur-xl bg-[radial-gradient(circle,rgba(10,123,182,0.18),transparent_60%)]" />
                </div>

                <div className="min-w-0">
                    <div className="text-[clamp(0.95rem,1.05vw,1rem)] font-semibold text-white truncate">
                        {friend.name}
                    </div>
                    <div className="text-[clamp(0.75rem,0.9vw,0.82rem)] text-white/45">
                        Member
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#36455f] px-3 py-2 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <Image src={"/icons/coin.png"} width={20} height={20} sizes="20px" alt="Coin" />
                <span className="text-[clamp(0.9rem,1vw,1rem)] font-semibold tracking-wide text-[#E7B24A]">
                    {friend.coins.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
