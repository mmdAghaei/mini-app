"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { WalletConnectModal } from "@walletconnect/modal";
import { ethers } from "ethers";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const wcModal = projectId
    ? new WalletConnectModal({
        projectId,
        themeMode: "dark",
    })
    : null;

export default function Start() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState("");
    const providerRef = useRef(null);

    // اگر قبلاً ولت ذخیره شده، برو balance
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/me/balance", {
                    method: "GET",
                    cache: "no-store",
                    headers: { "Cache-Control": "no-store" },
                });
                const json = await res.json();
                if (json?.success && json?.wallet_address) {
                    router.replace("/balance");
                    return;
                }
            } catch { }
            setLoading(false);
        })();
    }, [router]);

    const connectAndSave = async () => {
        if (!projectId) return setError("WalletConnect Project ID not set");
        if (!wcModal) return setError("WalletConnect modal not initialized");

        setConnecting(true);
        setError("");

        try {
            if (providerRef.current) {
                try { await providerRef.current.disconnect(); } catch { }
                providerRef.current = null;
            }

            const provider = await EthereumProvider.init({
                projectId,
                chains: [1],
                optionalChains: [1],
                showQrModal: false,
                methods: ["eth_requestAccounts", "eth_chainId"],
                events: ["accountsChanged", "chainChanged", "disconnect"],
                metadata: {
                    name: "MediTechX",
                    description: "MediTechX Mini App",
                    url: "https://MediTechX.com",
                    icons: ["https://vee.pickshop.ir/icons/coin.png"],
                },
            });

            providerRef.current = provider;

            const onDisplayUri = (uri) => wcModal.openModal({ uri });
            provider.on("display_uri", onDisplayUri);

            const accounts = await provider.enable();

            provider.removeListener?.("display_uri", onDisplayUri);
            try { await wcModal.closeModal(); } catch { }

            const address = ethers.getAddress(accounts?.[0] || "");
            if (!address) throw new Error("No wallet address returned");

            // ذخیره در DB
            const save = await fetch("/api/me/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet_address: address }),
            });

            const saved = await save.json();
            if (!saved.success) throw new Error(saved.message || "save failed");

            router.replace("/balance");
        } catch (e) {
            try { await wcModal.closeModal(); } catch { }
            setError(e?.message || "connect failed");
        } finally {
            setConnecting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-[420px] rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
                <h1 className="text-xl font-extrabold">Connect your wallet</h1>
                <p className="mt-2 text-sm text-white/60">Choose your wallet to enter the app.</p>

                {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

                <div className="mt-6 space-y-3">
                    <button
                        disabled={connecting}
                        onClick={connectAndSave}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F6851B] to-[#ffb35a] text-black font-extrabold disabled:opacity-50"
                    >
                        {connecting ? "Connecting..." : "Connect MetaMask"}
                    </button>

                    <button
                        disabled={connecting}
                        onClick={connectAndSave}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#3375BB] to-[#6aa8ff] text-black font-extrabold disabled:opacity-50"
                    >
                        {connecting ? "Connecting..." : "Connect Trust Wallet"}
                    </button>

                    <button
                        onClick={() => router.replace("/balance")}
                        className="w-full h-12 rounded-2xl bg-white/10 border border-white/15 text-white/80 font-semibold"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}