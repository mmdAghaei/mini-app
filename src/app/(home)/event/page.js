'use client';

import Image from "next/image";

const PATTERNS = [
    {
        backgroundImage:
            "radial-gradient(700px 220px at 20% 0%, rgba(245,158,11,0.28), transparent 60%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(30,41,59,0.88))",
    },
    {
        backgroundImage:
            "radial-gradient(700px 220px at 80% 10%, rgba(99,102,241,0.30), transparent 55%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.90))",
    },
    {
        backgroundImage:
            "radial-gradient(700px 220px at 50% -10%, rgba(236,72,153,0.24), transparent 55%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(17,24,39,0.90))",
    },
    {
        backgroundImage:
            "radial-gradient(700px 220px at 10% 90%, rgba(34,197,94,0.22), transparent 55%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.92))",
    },
    {
        backgroundImage:
            "radial-gradient(700px 220px at 90% 80%, rgba(14,165,233,0.24), transparent 58%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(30,41,59,0.90))",
    },
    {
        backgroundImage:
            "radial-gradient(800px 260px at 50% 0%, rgba(213,255,123,0.18), transparent 60%), linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.92))",
    },
];

function EventCard({ item, index }) {
    const hasImage = Boolean(item.image);
    const hasLogo = Boolean(item.logo);

    const patternStyle = PATTERNS[index % PATTERNS.length];

    return (
        <div
            className={[
                "relative overflow-hidden w-full",
                "rounded-[clamp(1rem,2.4vw,1.25rem)]",
                "border border-white/10",
                "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
                "transition hover:translate-y-[-2px] hover:border-white/20",
                // ✅ ارتفاع واقعی (دیگه ریز نمیشه)
                item.isFullWidth
                    ? "col-span-full min-h-[clamp(10rem,22vw,16rem)]"
                    : "min-h-[clamp(9rem,18vw,14rem)]",
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
                        <h1 className="text-[clamp(1rem,1.4vw,1.25rem)] font-bold text-white/95 leading-snug_crc">
                            {item.text}
                        </h1>
                        <p className="mt-1 text-[clamp(0.78rem,1vw,0.9rem)] text-white/55">
                            Tap to open details
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Event() {
    const dataList = [
        { text: "Hi", image: "", logo: "", isFullWidth: false },
        { text: "Hello", image: "/path/to/image1.jpg", logo: "", isFullWidth: false },
        { text: "Welcome", image: "", logo: "/path/to/logo1.png", isFullWidth: true },
        { text: "Good Morning", image: "", logo: "", isFullWidth: true },
        { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false },
        { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false },
        { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false },
    ];

    return (
        <div className="min-h-[100dvh] w-full h-screen">
            <div className="min-h-[100dvh] w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* ✅ اگه صفحه‌ت تو یه layout باریکه، این max-w کمک می‌کنه درست پر بشه */}
                <div className="mx-auto w-full max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(0.75rem,2vw,1.25rem)]">
                        {dataList.map((item, index) => (
                            <EventCard key={index} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
