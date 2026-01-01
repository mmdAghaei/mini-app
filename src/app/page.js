import Image from "next/image";
import Link from "next/link";

export default function Splash() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/Page/bg-1.png"
        alt=""
        fill
        className="object-cover"
        priority
      />


      <Link href="/balance">
        <button
          className="
    absolute
    bottom-25
    left-1/2
    -translate-x-1/2
    flex
    items-center
    gap-3
    px-8
    h-[2.875rem]
    rounded-full
    text-white
    text-[1.188rem]
    font-inter
    bg-gradient-to-b
    from-[#0d97c7]
    to-[#0a6486]
    hover:scale-105
    transition
    duration-300 
  "
        >
          <Image
            src="/Page/wallet.svg"
            width={20}
            height={16}
            alt=""
          />
          <b>Connect Wallet</b>
        </button></Link>

    </div>
  );
}
