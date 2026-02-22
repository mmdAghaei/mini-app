'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PATTERNS = [
    { backgroundImage: "radial-gradient(700px 220px at 20% 0%, rgba(245,158,11,0.28), transparent 60%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(30,41,59,0.88))" },
    { backgroundImage: "radial-gradient(700px 220px at 80% 10%, rgba(99,102,241,0.30), transparent 55%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.90))" },
    { backgroundImage: "radial-gradient(700px 220px at 50% -10%, rgba(236,72,153,0.24), transparent 55%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(17,24,39,0.90))" },
    { backgroundImage: "radial-gradient(700px 220px at 10% 90%, rgba(34,197,94,0.22), transparent 55%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.92))" },
    { backgroundImage: "radial-gradient(700px 220px at 90% 80%, rgba(14,165,233,0.24), transparent 58%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(30,41,59,0.90))" },
    { backgroundImage: "radial-gradient(800px 260px at 50% 0%, rgba(213,255,123,0.18), transparent 60%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.92))" },
];

function RefreshIcon({ spinning }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={[
                "h-5 w-5",
                spinning ? "animate-spin" : "",
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
        </svg>
    );
}

function EventCard({ item, index }) {
    const hasImage = Boolean(item.image);
    const hasLogo = Boolean(item.logo);
    const patternStyle = PATTERNS[index % PATTERNS.length];

    const CardInner = (
        <div
            className={[
                "relative overflow-hidden w-full",
                "rounded-[clamp(1rem,2.4vw,1.25rem)]",
                "border border-white/10",
                "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
                "transition hover:translate-y-[-2px] hover:border-white/20",
                item.isFullWidth
                    ? "col-span-full min-h-[clamp(10rem,22vw,16rem)]"
                    : "min-h-[clamp(9rem,18vw,14rem)]",
                item.href ? "cursor-pointer" : "",
            ].join(" ")}
            style={!hasImage ? patternStyle : undefined}
        >
            {/* image background */}
            {hasImage && (
                <>
                    <Image
                        src={item.image}
                        alt={item.text}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.80))]" />
                </>
            )}

            {/* logo (optional) */}
            {hasLogo && (
                <div className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10">
                    <div className="rounded-xl bg-black/25 border border-white/15 backdrop-blur px-3 py-2">
                        <Image
                            src={item.logo}
                            alt="logo"
                            width={84}
                            height={28}
                            className="h-6 w-auto object-contain"
                        />
                    </div>
                </div>
            )}

            {/* content */}
            <div className="absolute inset-0 flex items-end">
                <div className="w-full p-[clamp(0.9rem,2.4vw,1.25rem)]">
                    <div className="rounded-[clamp(0.9rem,2vw,1.1rem)] border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
                        <h1 className="text-[clamp(1rem,1.4vw,1.25rem)] font-bold text-white/95 leading-snug">
                            {item.text}
                        </h1>
                        <p className="mt-1 text-[clamp(0.78rem,1vw,0.9rem)] text-white/55">
                            {item.href ? "Tap to open details" : "—"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (item.href) {
        return (
            <Link href={item.href} className="block focus:outline-none focus:ring-2 focus:ring-white/20 rounded-[clamp(1rem,2.4vw,1.25rem)]">
                {CardInner}
            </Link>
        );
    }

    return CardInner;
}

function SkeletonCard({ isFullWidth }) {
    return (
        <div
            className={[
                "relative overflow-hidden w-full",
                "rounded-[clamp(1rem,2.4vw,1.25rem)]",
                "border border-white/10",
                "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
                "bg-white/5",
                "animate-pulse",
                isFullWidth
                    ? "col-span-full min-h-[clamp(10rem,22vw,16rem)]"
                    : "min-h-[clamp(9rem,18vw,14rem)]",
            ].join(" ")}
        >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.95),rgba(30,41,59,0.88))]" />
            <div className="absolute bottom-4 left-4 right-4 h-16 rounded-xl bg-white/10 border border-white/10" />
        </div>
    );
}

export default function Event() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const fetchEvents = useCallback(async ({ isRefresh = false } = {}) => {
        try {
            setError("");
            isRefresh ? setRefreshing(true) : setLoading(true);

            const res = await fetch("/api/event", { cache: "no-store" });
            const json = await res.json();

            if (!res.ok || !json?.success) {
                throw new Error(json?.message || "Failed to load events");
            }

            setEvents(Array.isArray(json.events) ? json.events : []);
        } catch (e) {
            setError(e?.message || "Unknown error");
            setEvents([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();

        (async () => {
            try {
                const res = await fetch("/api/admin/me", {
                    cache: "no-store",
                });

                const json = await res.json();
                if (json?.success && json?.isAdmin) {
                    setIsAdmin(true);
                }
            } catch {
                setIsAdmin(false);
            }
        })();

    }, [fetchEvents]);
    const skeletonCount = useMemo(() => 6, []);

    return (
        <div
            className="w-full"
            style={{
                paddingTop:
                    "calc(env(safe-area-inset-top, 0px) + var(--header-top) + var(--header-h) + var(--gap))",
                paddingBottom: "var(--footer-h)",
            }}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-[calc(88px+1.25rem)]">
                <div className="mx-auto w-full max-w-6xl">
                    {/* Header row */}
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-white/90 font-semibold text-lg">Events</h2>
                            <p className="text-white/50 text-sm">
                                {loading ? "Loading..." : `${events.length} item(s)`}
                            </p>
                        </div>

                        <button
                            onClick={() => fetchEvents({ isRefresh: true })}
                            disabled={loading || refreshing}
                            className={[
                                "inline-flex items-center gap-2",
                                "rounded-xl px-4 py-2",
                                "border border-white/15 bg-white/5 backdrop-blur",
                                "text-white/85 text-sm font-medium",
                                "hover:bg-white/10 hover:border-white/25 transition",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                            ].join(" ")}
                            aria-label="Refresh events"
                            title="Refresh"
                        >
                            <RefreshIcon spinning={refreshing} />
                            Refresh
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => router.push("/dashboard/event/add")}
                                className={[
                                    "inline-flex items-center gap-2",
                                    "rounded-xl px-4 py-2",
                                    "border border-white/15 bg-white/5 backdrop-blur",
                                    "text-white/85 text-sm font-medium",
                                    "hover:bg-white/10 hover:border-white/25 transition",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                ].join(" ")}
                                aria-label="Refresh events"
                                title="Refresh"
                            >
                                Add
                            </button>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-200/90">
                            {error}
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(0.75rem,2vw,1.25rem)]">
                        {loading ? (
                            Array.from({ length: skeletonCount }).map((_, i) => (
                                <SkeletonCard key={i} isFullWidth={i === 0} />
                            ))
                        ) : events.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                                No active events found.
                            </div>
                        ) : (
                            events.map((item, index) => (
                                <EventCard key={`${item._id || index}`} item={item} index={index} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}