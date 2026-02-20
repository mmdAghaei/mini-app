import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomeLayout({ children }) {
    return (
        <>
            <div
                className="relative h-[100dvh] overflow-hidden bg-[#04080F]"
                style={{
                    "--header-h": "4.625rem",
                    "--header-top": "1rem",
                    "--footer-h": "88px",
                    "--fab-extra": "56px",
                    "--gap": "1rem",
                    
                }}
            >
                {/* BG blobs */}
                {/* <div
                    className="pointer-events-none absolute top-[-300px] left-1/2 -translate-x-1/2 w-[23.25rem] h-[23.25rem] rounded-full blur-[296px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(11,7,27,0.9)_0deg,rgba(141,0,251,0.9)_76.88deg,rgba(144,175,255,0.9)_120deg,rgba(151,51,252,0.9)_161.25deg,rgba(130,91,255,0.9)_198.75deg,rgba(111,229,187,0.9)_236.25deg,rgba(157,237,255,0.9)_260.62deg,rgba(11,7,27,0.9)_360deg)] -z-10"
                />
                <div
                    className="pointer-events-none absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[23.25rem] h-[23.25rem] rounded-full blur-[296px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(11,7,27,0.9)_0deg,rgba(141,0,251,0.9)_76.88deg,rgba(144,175,255,0.9)_120deg,rgba(151,51,252,0.9)_161.25deg,rgba(130,91,255,0.9)_198.75deg,rgba(111,229,187,0.9)_236.25deg,rgba(157,237,255,0.9)_260.62deg,rgba(11,7,27,0.9)_360deg)] -z-10"
                /> */}
                <div className="w-full h-[23.25rem] absolute top-[-300px] [filter:blur(296.28px)] rounded-[50%] [background:conic-gradient(from_180deg_at_50%_50%,_rgba(11,_7,_27,_0.9)_0deg,_rgba(141,_0,_251,_0.9)_76.88deg,_rgba(144,_175,_255,_0.9)_120deg,_rgba(151,_51,_252,_0.9)_161.25deg,_rgba(130,_91,_255,_0.9)_198.75deg,_rgba(111,_229,_187,_0.9)_236.25deg,_rgba(157,_237,_255,_0.9)_260.62deg,_rgba(11,_7,_27,_0.9)_360deg)]" />
                <div className="w-full h-[23.25rem] absolute bottom-[-300px] [filter:blur(296.28px)] rounded-[50%] [background:conic-gradient(from_180deg_at_50%_50%,_rgba(11,_7,_27,_0.9)_0deg,_rgba(141,_0,_251,_0.9)_76.88deg,_rgba(144,_175,_255,_0.9)_120deg,_rgba(151,_51,_252,_0.9)_161.25deg,_rgba(130,_91,_255,_0.9)_198.75deg,_rgba(111,_229,_187,_0.9)_236.25deg,_rgba(157,_237,_255,_0.9)_260.62deg,_rgba(11,_7,_27,_0.9)_360deg)]" />

                {/* ثابت روی صفحه */}
                <Header />
                <Footer />

                <main
                    className="h-[100dvh] overflow-y-auto overscroll-contain flex justify-center px-4 sm:px-6"
                    
                >
                    <div className="w-full max-w-6xl">{children}</div>
                </main>
            </div>
        </>
    );
}
