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

    const incoming = (tgStartParam || urlRef || "").trim();
    if (incoming) localStorage.setItem("pending_ref", incoming);

    const refCode = localStorage.getItem("pending_ref") || "";

    (async () => {
      try {
        // 1) auth telegram
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, refCode }),
        });

        const json = await res.json();
        if (json?.success && json?.isNew) localStorage.removeItem("pending_ref");
        if (!json?.success) return;

        // 2) بعد auth: ببین ولت ثبت شده یا نه
        const bal = await fetch("/api/me/balance", {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });

        const balJson = await bal.json();

        if (balJson?.success && balJson?.wallet_address) {
          router.replace("/balance");
        } else {
          router.replace("/start");
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [userData?.id, router]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image src="/Page/bg-1.png" alt="Background Image" fill className="object-cover" priority />
    </div>
  );
}