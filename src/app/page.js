"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserComponnet";

export default function Splash() {
  const { userData } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userData?.id) return;

    const tgStartParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param || "";
    const urlRef = new URLSearchParams(window.location.search).get("ref") || "";
    const refCode = (tgStartParam || urlRef || "").trim();

    (async () => {
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...userData,
            refCode, // ✅ این اضافه شد
          }),
        });

        const json = await res.json();
        if (json?.success) router.replace("/balance");
      } catch (e) {
        console.error(e);
      }
    })();
  }, [userData?.id]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image src="/Page/bg-1.png" alt="Background Image" fill className="object-cover" priority />
    </div>
  );
}