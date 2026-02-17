"use client";

import { useEffect, useMemo, useState } from "react";
import { useBalance } from "@/components/BalanceStore";

/* utils */
function groupByCategory(items) {
    const map = new Map();
    for (const item of items) {
        if (!map.has(item.category)) map.set(item.category, []);
        map.get(item.category).push(item);
    }
    return Array.from(map, ([category, tasks]) => ({ category, tasks }));
}

function isValidHttpUrl(value) {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function Icon({ icon, className = "w-5 h-5" }) {
    const common = className;

    switch (icon) {
        case "telegram":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M21.9 4.6c.2-.9-.7-1.6-1.5-1.2L2.8 11.3c-.9.4-.8 1.7.1 2l4.6 1.6 1.7 5.4c.3.9 1.5 1 2 .2l2.6-3.7 4.9 3.6c.7.5 1.7.1 1.9-.8l2.3-15.0Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                    <path
                        d="M7.8 14.9 18.9 6.8c.4-.3.9.2.5.6l-8.9 8.4c-.3.3-.5.7-.5 1.2l-.1 3.3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>
            );
        case "youtube":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M21.6 7.3a3 3 0 0 0-2.1-2.1C17.7 4.7 12 4.7 12 4.7s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.3 31.5 31.5 0 0 0 2 12c0 1.6.1 3.1.4 4.7a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.6.4-3.1.4-4.7s-.1-3.1-.4-4.7Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                    <path
                        d="M10.3 9.3v5.4c0 .5.5.8 1 .5l4.7-2.7c.5-.3.5-1.1 0-1.4l-4.7-2.7c-.5-.3-1 .1-1 .6Z"
                        fill="#0b0b0b"
                        opacity="0.95"
                    />
                </svg>
            );
        case "x":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M18.5 3H21l-6.6 7.5L22 21h-6.2l-4.8-6.3L5.4 21H3l7.1-8.1L2 3h6.3l4.4 5.7L18.5 3Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                </svg>
            );
        default:
            return null;
    }
}

function CoinIcon() {
    return (
        <svg className="w-[clamp(0.9rem,1.4vw,1rem)] h-[clamp(0.9rem,1.4vw,1rem)]" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.8c5 0 9.2 2.7 9.2 6.1S17 15 12 15 2.8 12.3 2.8 8.9 7 2.8 12 2.8Z" fill="currentColor" opacity="0.9" />
            <path d="M21.2 8.9v6.2c0 3.4-4.1 6.1-9.2 6.1s-9.2-2.7-9.2-6.1V8.9" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
        </svg>
    );
}

function TaskCard({ item, onOpen }) {
    const iconWrap =
        item.icon === "telegram"
            ? "bg-sky-500/90 text-white rounded-full"
            : item.icon === "youtube"
                ? "bg-red-600/90 text-white rounded-xl"
                : "bg-white/10 text-white/85 rounded-xl";

    return (
        <div className="rounded-[clamp(1rem,2.2vw,1.25rem)] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
            <div className="px-[clamp(1rem,2.4vw,1.25rem)] pt-[clamp(0.9rem,2vw,1.1rem)] pb-[clamp(0.75rem,1.6vw,0.9rem)]">
                <div className="flex items-center gap-[clamp(0.6rem,1.6vw,0.85rem)]">
                    <div className={["flex items-center justify-center h-[clamp(2.4rem,4.2vw,2.75rem)] w-[clamp(2.4rem,4.2vw,2.75rem)]", iconWrap].join(" ")}>
                        <Icon icon={item.icon} className="w-[clamp(1.1rem,2vw,1.25rem)] h-[clamp(1.1rem,2vw,1.25rem)]" />
                    </div>
                    <p className="text-[clamp(0.95rem,0.9vw,1.05rem)] font-medium text-white/90 leading-snug">{item.title}</p>
                </div>
            </div>

            <div className="h-px bg-white/10 mx-[clamp(1rem,2.4vw,1.25rem)]" />

            <div className="px-[clamp(1rem,2.4vw,1.25rem)] py-[clamp(0.75rem,1.6vw,0.95rem)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-300">
                    <CoinIcon />
                    <span className="text-[clamp(0.78rem,0.75vw,0.85rem)] font-semibold tracking-wide">+{item.xp} XP</span>
                </div>

                <button
                    onClick={() => onOpen(item)}
                    className="rounded-full px-[clamp(1.35rem,3vw,2rem)] py-[clamp(0.35rem,0.9vw,0.45rem)] text-[clamp(0.78rem,0.75vw,0.85rem)] font-semibold text-white/80 bg-white/10 border border-white/15 hover:bg-white/15 active:scale-[0.99] transition"
                >
                    Open
                </button>
            </div>
        </div>
    );
}

function GoDialog({ open, item, onClose, onClaim }) {
    const [mounted, setMounted] = useState(false);
    const [went, setWent] = useState(false);
    const [claiming, setClaiming] = useState(false);

    const link = item?.link || "";
    const canOpen = isValidHttpUrl(link);
    const canCheck = went && !claiming;

    useEffect(() => {
        if (open) {
            setMounted(true);
            setWent(false);
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        } else {
            const t = setTimeout(() => setMounted(false), 200);
            return () => clearTimeout(t);
        }
    }, [open]);

    if (!mounted || !item) return null;

    const handleGo = () => {
        if (!canOpen) return;

        // داخل تلگرام بهتره این رو بزنی:
        const tg = window?.Telegram?.WebApp;
        if (tg?.openTelegramLink && link.includes("t.me/")) tg.openTelegramLink(link);
        else window.open(link, "_blank", "noopener,noreferrer");

        setWent(true);
    };

    const handleCheck = async () => {
        if (!canCheck) return;
        setClaiming(true);
        try {
            await onClaim(item._id);
            onClose();
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-end justify-center">
            <div className={["absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200", open ? "opacity-100" : "opacity-0"].join(" ")} onClick={onClose} />

            <div className={["relative w-full max-w-[30rem] transition-transform transition-opacity duration-200 ease-out", open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"].join(" ")}>
                <div className="rounded-t-3xl bg-slate-950/95 border border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
                    <div className="flex justify-center pt-3">
                        <div className="h-1.5 w-10 rounded-full bg-white/25" />
                    </div>

                    <div className="flex justify-center mt-4">
                        <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center">
                            <Icon icon={item.icon} className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="px-5 pt-4 pb-6">
                        <p className="text-center text-white font-semibold text-lg">{item.title}</p>
                        <p className="mt-2 text-center text-sm text-white/50 break-all">{link}</p>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleGo}
                                disabled={!canOpen}
                                className="w-full rounded-2xl py-4 font-semibold text-base bg-white/15 border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Go
                            </button>

                            <button
                                onClick={handleCheck}
                                disabled={!canCheck}
                                className={[
                                    "w-full rounded-2xl py-4 font-semibold text-base border transition",
                                    canCheck ? "bg-white/20 border-white/30 text-white" : "bg-white/10 border-white/15 text-white/60",
                                ].join(" ")}
                            >
                                {claiming ? "Checking..." : "Check"}
                            </button>

                            {!went ? <p className="text-center text-xs text-white/40">First press Go, then join and come back to press Check.</p> : null}
                        </div>

                        {!canOpen ? <p className="mt-4 text-center text-sm text-rose-300">Link is not valid (http/https)</p> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [selected, setSelected] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/tasks");
            const json = await res.json();
            if (json.success) setTasks(json.tasks || []);
        })();
    }, []);

    const groups = useMemo(() => groupByCategory(tasks), [tasks]);

    const onOpen = (item) => {
        setSelected(item);
        setDialogOpen(true);
    };
    const { setPoints } = useBalance();

    const onClaim = async (taskId) => {
        const res = await fetch("/api/tasks/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId }),
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.message || "claim failed");

        // ✅ همین باعث میشه Header/Profile بدون رفرش آپدیت شه
        setPoints(json.points);

        setTasks((prev) => prev.filter((t) => t._id !== taskId));
    };
    return (
        <div
            className="min-h-[100dvh] h-screen"
            style={{
                paddingTop: "calc(env(safe-area-inset-top, 0px) + var(--header-top) + var(--header-h) + var(--gap) + 15px)",
                paddingBottom: "calc(var(--footer-h) + 120px + var(--gap))",
            }}
        >
            <div className="mx-auto w-full max-w-[clamp(20rem,80vw,72rem)]  pb-[clamp(3.5rem,8vh,6rem)]"

                style={{
                    paddingBottom: "calc(var(--footer-h) + 20px + var(--gap))",
                }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1rem,2.2vw,1.6rem)]">
                    {groups.map((g) => (
                        <section key={g.category} className="space-y-[clamp(0.75rem,1.6vw,1rem)]">
                            <h2 className="text-[clamp(1.05rem,1.2vw,1.25rem)] font-semibold tracking-wide text-white/90">
                                {g.category}
                            </h2>

                            <div className="space-y-[clamp(0.65rem,1.4vw,0.85rem)]">
                                {g.tasks.map((item) => (
                                    <TaskCard key={item._id} item={item} onOpen={onOpen} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <GoDialog open={dialogOpen} item={selected} onClose={() => setDialogOpen(false)} onClaim={onClaim} />
        </div>
    );
}