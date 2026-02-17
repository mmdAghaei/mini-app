import EthereumProvider from "@walletconnect/ethereum-provider";
import { WalletConnectModal } from "@walletconnect/modal";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wcModal = projectId
    ? new WalletConnectModal({
        projectId,
        themeMode: "dark",
    })
    : null;

export async function connectWallet() {
    if (!projectId) throw new Error("WalletConnect Project ID is missing");

    const provider = await EthereumProvider.init({
        projectId,
        chains: [1],
        showQrModal: false, // ❗️ما مودال خودمون رو باز می‌کنیم
        methods: ["eth_requestAccounts", "personal_sign", "eth_chainId"],
        events: ["accountsChanged", "chainChanged", "disconnect"],
        metadata: {
            name: "MmdCoin Referral",
            description: "MmdCoin mini app",
            url: "https://YOUR_DOMAIN.com", // مهم: باید https باشه
            icons: ["https://YOUR_DOMAIN.com/icon.png"],
        },
    });

    // وقتی uri آماده شد مودال رو باز کن
    provider.on("display_uri", (uri) => {
        wcModal?.openModal({ uri });
    });

    const accounts = await provider.enable(); // اینجا display_uri trigger میشه
    await wcModal?.closeModal();

    return { provider, accounts };
}