import TelegramInsets from "@/components/TelegramInsets";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomeLayout({ children }) {
    return (
        <div
            className="relative h-[100dvh] overflow-hidden"
            style={{
                "--header-h": "4.625rem",
                "--footer-h": "88px",
                "--gap": "1rem",
                "--fab-extra": "56px",
            }}
        >
            <TelegramInsets />

            <Header />
            <Footer />

            <main
                className="h-[100dvh] overflow-y-auto overscroll-contain flex justify-center px-4 sm:px-6"
                style={{
                    paddingTop:
                        "calc(max(env(safe-area-inset-top, 0px), var(--tg-top, 0px)) + var(--header-h) + var(--gap))",
                    paddingBottom:
                        "calc(max(env(safe-area-inset-bottom, 0px), var(--tg-bottom, 0px)) + var(--footer-h) + var(--fab-extra) + var(--gap))",
                }}
            >
                <div className="w-full max-w-6xl">{children}</div>
            </main>
        </div>
    );
}
