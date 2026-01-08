"use client";

import {
    useEffect,
    useMemo,
    useState,
    cloneElement,
    isValidElement,
} from "react";

/** ✅ نمونه‌ی آیکون دستی (Custom) */
const CustomBoltIcon = (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M13 2 3 14h8l-1 8 11-14h-8l0-6Z"
            fill="currentColor"
            opacity="0.95"
        />
    </svg>
);

const TASKS = [
    // ===== MediTechX Community =====
    {
        id: "tg",
        category: "MediTechX Community",
        title: "Join Our Telegram Channel",
        xp: 100,
        icon: "telegram",
        link: "https://t.me/meditechx",
        tone: "default",
    },
    {
        id: "yt",
        category: "MediTechX Community",
        title: "Subscribe to Our YouTube",
        xp: 100,
        icon: "youtube",
        link: "https://youtube.com/@meditechx",
        tone: "default",
    },
    {
        id: "x",
        category: "MediTechX Community",
        title: "Subscribe to Our X",
        xp: 100,
        icon: "x",
        link: "https://x.com/meditechx",
        tone: "default",
    },
    {
        id: "discord",
        category: "MediTechX Community",
        title: "Join Our Discord Server",
        xp: 150,
        icon: "discord",
        link: "https://discord.com/invite/meditechx",
        tone: "default",
    },
    {
        id: "github",
        category: "MediTechX Community",
        title: "Star Our GitHub Repo",
        xp: 120,
        icon: "github",
        link: "https://github.com/meditechx",
        tone: "default",
    },

    // ===== MediTechX Learn =====
    {
        id: "docs",
        category: "MediTechX Learn",
        title: "Read the Quickstart Docs",
        xp: 80,
        icon: "book",
        link: "https://meditechx.com/docs",
        tone: "default",
    },
    {
        id: "blog",
        category: "MediTechX Learn",
        title: "Read Our Latest Blog Post",
        xp: 60,
        icon: "link",
        link: "https://meditechx.com/blog",
        tone: "default",
    },
    {
        id: "newsletter",
        category: "MediTechX Learn",
        title: "Join Our Newsletter",
        xp: 90,
        icon: "sparkle",
        link: "https://meditechx.com/newsletter",
        tone: "default",
    },
    {
        id: "custom-icon-task",
        category: "MediTechX Learn",
        title: "Special Mission (Custom Icon)",
        xp: 200,
        icon: CustomBoltIcon, // ✅ آیکون دستی
        iconBg: "bg-emerald-500/80 text-white", // ✅ رنگ بک‌گراند دستی برای آیکون
        link: "https://meditechx.com/special",
        tone: "default",
    },

    // ===== MediTechX PartenShip =====
    {
        id: "coinstore",
        category: "MediTechX PartenShip",
        title: "Join CoinStore Telegram Channel",
        xp: 100,
        icon: "power",
        link: "https://t.me/coinstore",
        tone: "purple",
    },
    {
        id: "partners",
        category: "MediTechX PartenShip",
        title: "Apply for Partnership",
        xp: 250,
        icon: "link",
        link: "https://meditechx.com/partners",
        tone: "purple",
    },
    {
        id: "affiliate",
        category: "MediTechX PartenShip",
        title: "Join Affiliate Program",
        xp: 180,
        icon: "sparkle",
        link: "https://meditechx.com/affiliate",
        tone: "purple",
    },
];

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

/**
 * ✅ Icon component:
 * - اگر icon string بود، از آیکون‌های آماده استفاده می‌کنه
 * - اگر icon JSX/SVG بود، همونو رندر می‌کنه (Custom)
 */
function Icon({ icon, className = "w-5 h-5" }) {
    // custom JSX icon
    if (isValidElement(icon)) {
        const merged = [icon.props?.className, className].filter(Boolean).join(" ");
        return cloneElement(icon, { className: merged, "aria-hidden": true });
    }

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

        case "power":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path
                        d="M7.5 4.6a9 9 0 1 0 9 0"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
            );

        case "github":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M12 2.5c-5.2 0-9.5 4.3-9.5 9.6 0 4.2 2.7 7.8 6.4 9.1.5.1.7-.2.7-.5v-1.8c-2.6.6-3.2-1.1-3.2-1.1-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.3 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2.1-.2-4.3-1.1-4.3-4.8 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.7 1a9.1 9.1 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.7 0 3.7-2.2 4.6-4.3 4.8.3.3.7.9.7 1.8v2.7c0 .3.2.6.7.5 3.7-1.3 6.4-4.9 6.4-9.1 0-5.3-4.3-9.6-9.5-9.6Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                </svg>
            );

        case "discord":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M19.4 5.2a15 15 0 0 0-3.7-1.2l-.5 1c-1.4-.2-2.9-.2-4.3 0l-.5-1c-1.3.2-2.5.6-3.7 1.2C4.8 8 4.3 10.8 4.5 13.6c1.5 1.1 3.2 1.9 5 2.3l.7-1.2c-.6-.2-1.2-.5-1.7-.9l.4-.3c3.2 1.5 6.7 1.5 9.9 0l.4.3c-.5.4-1.1.7-1.7.9l.7 1.2c1.8-.4 3.5-1.2 5-2.3.3-2.9-.2-5.6-2.1-8.4Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                    <path
                        d="M9.4 12.7c.6 0 1-.5 1-1.1s-.4-1.1-1-1.1-1 .5-1 1.1.4 1.1 1 1.1Zm5.2 0c.6 0 1-.5 1-1.1s-.4-1.1-1-1.1-1 .5-1 1.1.4 1.1 1 1.1Z"
                        fill="#0b0b0b"
                        opacity="0.8"
                    />
                </svg>
            );

        case "book":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M6.5 3.5h10A2.5 2.5 0 0 1 19 6v14.5a1 1 0 0 1-1.4.9c-1.7-.8-3.6-.8-5.3 0a1 1 0 0 1-.8 0c-1.7-.8-3.6-.8-5.3 0A1 1 0 0 1 4.8 20.5V6A2.5 2.5 0 0 1 6.5 3.5Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                </svg>
            );

        case "link":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M10 13.5a4 4 0 0 1 0-5.7l1.4-1.4a4 4 0 0 1 5.7 5.7l-1 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M14 10.5a4 4 0 0 1 0 5.7l-1.4 1.4a4 4 0 0 1-5.7-5.7l1-1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            );

        case "sparkle":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M12 2l1.2 4.2L17.5 8l-4.3 1.8L12 14l-1.2-4.2L6.5 8l4.3-1.8L12 2Z"
                        fill="currentColor"
                        opacity="0.95"
                    />
                    <path
                        d="M5 13l.7 2.3L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.7L5 13Zm14 0 .7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z"
                        fill="currentColor"
                        opacity="0.7"
                    />
                </svg>
            );

        default:
            return null;
    }
}

function CoinIcon() {
    return (
        <svg
            className="w-[clamp(0.9rem,1.4vw,1rem)] h-[clamp(0.9rem,1.4vw,1rem)]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M12 2.8c5 0 9.2 2.7 9.2 6.1S17 15 12 15 2.8 12.3 2.8 8.9 7 2.8 12 2.8Z"
                fill="currentColor"
                opacity="0.9"
            />
            <path
                d="M21.2 8.9v6.2c0 3.4-4.1 6.1-9.2 6.1s-9.2-2.7-9.2-6.1V8.9"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.7"
            />
            <path
                d="M12 6.1l.8 1.6 1.8.3-1.3 1.2.3 1.8L12 10.1l-1.6.9.3-1.8-1.3-1.2 1.8-.3.8-1.6Z"
                fill="#0b0b0b"
                opacity="0.85"
            />
        </svg>
    );
}

function TaskCard({ item, onGo }) {
    const isPurple = item.tone === "purple";

    const cardBg = isPurple
        ? "bg-gradient-to-br from-fuchsia-500/15 via-purple-500/10 to-white/5"
        : "bg-gradient-to-br from-white/10 to-white/5";

    const border = "border border-white/10";
    const shadow = "shadow-[0_14px_40px_rgba(0,0,0,0.45)]";

    const iconKey = typeof item.icon === "string" ? item.icon : "custom";

    const iconWrap =
        item.iconBg ||
        (() => {
            switch (iconKey) {
                case "telegram":
                    return "bg-sky-500/90 text-white";
                case "youtube":
                    return "bg-red-600/90 text-white rounded-xl";
                case "x":
                    return "bg-transparent text-white/85";
                case "power":
                    return "bg-transparent text-fuchsia-400";
                default:
                    return "bg-white/10 text-white/85";
            }
        })();

    return (
        <div
            className={[
                "rounded-[clamp(1rem,2.2vw,1.25rem)] overflow-hidden",
                cardBg,
                border,
                shadow,
            ].join(" ")}
        >
            <div className="px-[clamp(1rem,2.4vw,1.25rem)] pt-[clamp(0.9rem,2vw,1.1rem)] pb-[clamp(0.75rem,1.6vw,0.9rem)]">
                <div className="flex items-center gap-[clamp(0.6rem,1.6vw,0.85rem)]">
                    <div
                        className={[
                            "flex items-center justify-center",
                            "h-[clamp(2.4rem,4.2vw,2.75rem)] w-[clamp(2.4rem,4.2vw,2.75rem)]",
                            iconKey === "telegram" ? "rounded-full" : "rounded-[clamp(1rem,2vw,1.25rem)]",
                            iconWrap,
                        ].join(" ")}
                    >
                        <Icon
                            icon={item.icon}
                            className="w-[clamp(1.1rem,2vw,1.25rem)] h-[clamp(1.1rem,2vw,1.25rem)]"
                        />
                    </div>

                    <p className="text-[clamp(0.95rem,0.9vw,1.05rem)] font-medium text-white/90 leading-snug">
                        {item.title}
                    </p>
                </div>
            </div>

            <div className="h-px bg-white/10 mx-[clamp(1rem,2.4vw,1.25rem)]" />

            <div className="px-[clamp(1rem,2.4vw,1.25rem)] py-[clamp(0.75rem,1.6vw,0.95rem)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-300">
                    <CoinIcon />
                    <span className="text-[clamp(0.78rem,0.75vw,0.85rem)] font-semibold tracking-wide">
                        +{item.xp} XP
                    </span>
                </div>

                <button
                    onClick={() => onGo(item)}
                    className={[
                        "rounded-full",
                        "px-[clamp(1.35rem,3vw,2rem)] py-[clamp(0.35rem,0.9vw,0.45rem)]",
                        "text-[clamp(0.78rem,0.75vw,0.85rem)] font-semibold text-white/80",
                        "bg-white/10 border border-white/15",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
                        "hover:bg-white/15 active:scale-[0.99]",
                        "transition",
                    ].join(" ")}
                >
                    Go
                </button>
            </div>
        </div>
    );
}



 function GoDialog({ open, item, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const link = item?.link || "";
    const canGo = confirmed && isValidHttpUrl(link);

    useEffect(() => {
        if (open) {
            setMounted(true);
            setConfirmed(false);

            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        } else {
            const t = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    const handleGo = () => {
        if (!canGo) return;
        window.open(link, "_blank", "noopener,noreferrer");
        onClose();
    };

    if (!mounted || !item) return null;

    return (
        <div className="fixed inset-0 z-500 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className={[
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Go dialog"
                className={[
                    "relative w-full",
                    "max-w-[30rem]",
                    "transition-transform transition-opacity duration-300 ease-out",
                    open
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-full",
                ].join(" ")}
            >
                <div className="rounded-t-3xl bg-slate-950/95 border border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
                    {/* Handle */}
                    <div className="flex justify-center pt-3">
                        <div className="h-1.5 w-10 rounded-full bg-white/25" />
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mt-4">
                        <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center">
                            <Icon
                                icon={item.icon}
                                className="w-8 h-8 text-white"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 pt-4 pb-6">
                        <p className="text-center text-white font-semibold text-lg">
                            {item.title}
                        </p>

                        <p className="mt-2 text-center text-sm text-white/50 break-all">
                            {link}
                        </p>

                        {/* Buttons */}
                        <div className="mt-6 space-y-3">
                            <button
                                type="button"
                                onClick={() => setConfirmed((v) => !v)}
                                aria-pressed={confirmed}
                                className={[
                                    "w-full flex items-center justify-center gap-2",
                                    "rounded-2xl py-4",
                                    "font-semibold text-base",
                                    "border transition",
                                    confirmed
                                        ? "bg-white/20 border-white/30 text-white"
                                        : "bg-white/10 border-white/15 text-white/80",
                                ].join(" ")}
                            >
                                {confirmed ? "Checked ✓" : "Check"}
                            </button>

                            <button
                                onClick={handleGo}
                                disabled={!canGo}
                                className={[
                                    "w-full flex items-center justify-center gap-2",
                                    "rounded-2xl py-4",
                                    "font-semibold text-base",
                                    "bg-white/15 border border-white/20 text-white",
                                    "disabled:opacity-40 disabled:cursor-not-allowed",
                                ].join(" ")}
                            >
                                <Icon
                                    icon="mdi:arrow-top-right"
                                    className="w-5 h-5"
                                />
                                Go
                            </button>
                        </div>

                        {!isValidHttpUrl(link) && (
                            <p className="mt-4 text-center text-sm text-rose-300">
                                لینک معتبر نیست (http / https)
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default function Swap() {
    const [selected, setSelected] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const groups = useMemo(() => groupByCategory(TASKS), []);

    const onGo = (item) => {
        setSelected(item);
        setDialogOpen(true);
    };

    return (
        <div className="min-h-[100dvh] h-screen"
            style={{
                paddingTop: "calc(env(safe-area-inset-top, 0px) + var(--header-top) + var(--header-h) + var(--gap) + 15px)"
,
                paddingBottom: "var(--footer-h)",
            }}
        >
            <div className="mx-auto w-full max-w-[clamp(20rem,80vw,72rem)] px-[clamp(1rem,3vw,2rem)] pb-[clamp(3.5rem,8vh,6rem)]"
            
                style={{
                    paddingBottom: "var(--footer-h)",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1rem,2.2vw,1.6rem)]">
                    {groups.map((g) => (
                        <section key={g.category} className="space-y-[clamp(0.75rem,1.6vw,1rem)]">
                            <h2 className="text-[clamp(1.05rem,1.2vw,1.25rem)] font-semibold tracking-wide text-white/90">
                                {g.category}
                            </h2>

                            <div className="space-y-[clamp(0.65rem,1.4vw,0.85rem)]">
                                {g.tasks.map((item) => (
                                    <TaskCard key={item.id} item={item} onGo={onGo} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <GoDialog open={dialogOpen} item={selected} onClose={() => setDialogOpen(false)} />
        </div>
    );
}
