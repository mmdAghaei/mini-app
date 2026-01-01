import Image from "next/image";

export default function Balance() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
            {/* Title */}
            <b className="inline-block text-left text-[0.938rem] sm:text-base md:text-lg font-inter text-darkgray">
                Balance
            </b>

            {/* Balance Amount */}
            <div className="relative flex items-center justify-center">
                {/* Main text */}
                <b className="absolute inline-block text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl font-inter font-black text-transparent !bg-clip-text [background:linear-gradient(90deg,_#46dfff,_#fff)]">
                    100,000 MTX
                </b>

                {/* Glow */}
                <b className="relative inline-block text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl font-inter font-black text-transparent !bg-clip-text [background:conic-gradient(from_180deg_at_50%_50%,_rgba(11,_7,_27,_0.9)_0deg,_rgba(141,_0,_251,_0.9)_76.88deg,_rgba(144,_175,_255,_0.9)_120deg,_rgba(151,_51,_252,_0.9)_161.25deg,_rgba(130,_91,_255,_0.9)_198.75deg,_rgba(111,_229,_187,_0.9)_236.25deg,_rgba(157,_237,_255,_0.9)_260.62deg,_rgba(11,_7,_27,_0.9)_360deg)] [filter:blur(21.7px)]">
                    100,000 MTX
                </b>
            </div>

            {/* Actions */}
            <div className="flex w-full justify-center gap-4 sm:gap-8 md:gap-10 flex-wrap">
                {/* Withdraw */}
                <div className="flex h-[2.6rem] min-w-[120px] sm:min-w-[150px] md:min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
                    <span className="inline-block text-center text-[0.813rem] sm:text-[0.875rem] md:text-[1rem] font-inter font-semibold text-white opacity-[0.7]">
                        withdraw
                    </span>
                </div>

                {/* Exchange */}
                <div className="flex h-[2.6rem] min-w-[120px] sm:min-w-[150px] md:min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
                    <span className="inline-block text-center text-[0.813rem] sm:text-[0.875rem] md:text-[1rem] font-inter font-semibold text-white opacity-[0.7]">
                        exchange point
                    </span>
                </div>
            </div>

            <div className="h-[20rem] w-full max-w-[20rem] relative rounded-2xl border border-white/20 bg-white/20 backdrop-blur-xl shadow-xl mt-10">
                <div className="flex items-center mb-4 pl-2 pt-4">
                    <img src="/icons/mtxPageOne.svg" alt="Logo" className="w-8 h-8" />
                    <div className="ml-4">
                        <h2 className="text-[0.875rem] sm:text-base md:text-lg inline-block font-inter text-white">MediTechX</h2>
                        <p className="text-[0.688rem] sm:text-[0.75rem] md:text-base font-inter text-silver">MTX</p>
                    </div>
                </div>
                <div className="text-[1.75rem] sm:text-2xl md:text-3xl font-semibold font-inter text-white text-center inline-block pl-2">
                    $ 0.0532
                </div>

                <div className="w-full h-[9rem] relative bg-gainsboro" />
                <div className="flex justify-between text-sm sm:text-base md:text-lg flex-row gap-1 p-2">
                    <div className="basis-1/3 h-[2rem] relative rounded-[3px] bg-gray-100 flex justify-center items-center">
                        <span className="text-[.9rem] sm:text-[1rem] font-semibold font-inter text-darkgray">24:</span>
                        <span className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium font-inter text-salmon pl-2">-12%</span>
                    </div>

                    <div className="basis-1/3 h-[2rem] relative rounded-[3px] bg-gray-100 flex justify-center items-center">
                        <span className="text-[.9rem] sm:text-[1rem] font-semibold font-inter text-darkgray">High:</span>
                        <span className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium font-inter text-white pl-2">-12%</span>
                    </div>

                    <div className="basis-1/3 h-[2rem] relative rounded-[3px] bg-gray-100 flex justify-center items-center">
                        <span className="text-[.9rem] sm:text-[1rem] font-semibold font-inter text-darkgray">Low:</span>
                        <span className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium font-inter text-white pl-2">-12%</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
