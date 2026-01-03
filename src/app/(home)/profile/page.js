import Image from "next/image";

export default function Profile() {
    const friends = [
        { id: "1", name: "Mmd", coins: 7723 },
        { id: "2", name: "Mmd", coins: 7723 },
        { id: "3", name: "Mmd", coins: 7723 },
        { id: "4", name: "Mmd", coins: 7723 },
    ];
    return (
        <div className="w-100 h-150 relative flex-col flex p-4 items-center rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl mt-10">


            <div className="w-[4rem] h-[4rem] rounded-full bg-white/40" />
            <b className="w-[5.75rem] h-[1.25rem] relative text-[1.688rem] inline-block font-inter text-white text-left">Mhmd.</b>
            <div className="flex flex-row justify-center items-center mt-5">
                <Image src={"/icons/coin.png"} width={57.6} height={57.6} sizes="100vw" alt="Coin" />
                <div className="text-[2.124rem] font-black font-inter text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d5ff7b,_#f6fa00)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-left inline-block">15,000</div>
            </div>
            <div className="flex flex-row justify-between gap-3">
                <div className="w-[15rem] h-[3rem] rounded-sm bg-yellow-300 my-2 flex justify-center items-center text-[1.3rem] font-bold font-inter text-black" >
                    Invite Firends
                </div>
                <div className="w-[3rem] h-[3rem] rounded-sm bg-blue-950 my-2 " />


            </div>

            <div className="w-[20rem] h-[22rem] rounded-2xl bg-white/10 overflow-y-auto" >
                {friends.map((f) => (
                    <FriendRow key={f.id} friend={f} />
                ))}
            </div>
        </div>
    );
}


function FriendRow({ friend }) {
    return (
        <div className="flex items-start justify-between p-3">
            {/* Avatar */}
            <div className="flex flex-row justify-center items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neutral-200/90" />

                <div className="text-[1rem] font-semibold text-white">{friend.name}</div>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-[#36455f] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <Image src={"/icons/coin.png"} width={20} height={20} sizes="100vw" alt="Coin" />

                <span className="text-[1rem] font-semibold tracking-wide text-[#E7B24A]">
                    {friend.coins.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
