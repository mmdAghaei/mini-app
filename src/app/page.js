"use client"; // مهم است که این را در بالای کامپوننت قرار دهید تا کلاینتی بودن کامپوننت مشخص شود

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Web3Provider } from "@ethersproject/providers"; // برای متصل شدن به MetaMask

export default function Splash() {
  const [walletAddress, setWalletAddress] = useState("");  // ذخیره آدرس ولت
  const [isLoading, setIsLoading] = useState(false); // وضعیت لود شدن

  // تابع برای اتصال به MetaMask
  const connectMetaMask = async () => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // درخواست آدرس کیف پول
        const signer = provider.getSigner();
        const address = await signer.getAddress(); // گرفتن آدرس کیف پول
        setWalletAddress(address);
        setIsLoading(false);
        alert("MetaMask Wallet connected: " + address); // نمایش آدرس کیف پول پس از اتصال
      } else {
        alert("MetaMask is not installed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error connecting MetaMask wallet", error);
      setIsLoading(false);
    }
  };

  // تابع برای اتصال به Trust Wallet
  const connectTrustWallet = async () => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // درخواست آدرس کیف پول
        const signer = provider.getSigner();
        const address = await signer.getAddress(); // گرفتن آدرس کیف پول
        setWalletAddress(address);
        setIsLoading(false);
        alert("Trust Wallet connected: " + address); // نمایش آدرس کیف پول پس از اتصال
      } else {
        alert("Trust Wallet is not installed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error connecting Trust Wallet", error);
      setIsLoading(false);
    }
  };

  // برای چک کردن پشتیبانی MetaMask یا Trust Wallet در مرورگر
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      console.log("Ethereum detected!");
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/Page/bg-1.png"
        alt="Background Image"
        fill
        className="object-cover"
        priority
      />

      {/* دکمه‌های اتصال به کیف پول‌ها */}
      <div className="absolute bottom-25 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={connectMetaMask}
          disabled={isLoading}
          className="px-8 h-[2.875rem] rounded-full text-white text-[1.188rem] font-inter bg-gradient-to-b from-[#0d97c7] to-[#0a6486] hover:scale-105 transition duration-300"
        >
          {isLoading ? "Connecting to MetaMask..." : "Connect MetaMask"}
        </button>

        <button
          onClick={connectTrustWallet}
          disabled={isLoading}
          className="px-8 h-[2.875rem] rounded-full text-white text-[1.188rem] font-inter bg-gradient-to-b from-[#0d97c7] to-[#0a6486] hover:scale-105 transition duration-300"
        >
          {isLoading ? "Connecting to Trust Wallet..." : "Connect Trust Wallet"}
        </button>
      </div>

      {/* نمایش آدرس کیف پول */}
      {walletAddress && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm">
          <p>Wallet Address: {walletAddress}</p>
        </div>
      )}

      {/* دکمه برای باز کردن Trust Wallet از طریق Deep Linking */}
      <Link href="trust://wallet-connect">
        <button
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 h-[2.875rem] rounded-full text-white text-[1.188rem] font-inter bg-gradient-to-b from-[#0d97c7] to-[#0a6486] hover:scale-105 transition duration-300"
        >
          Open Trust Wallet
        </button>
      </Link>

      {/* دکمه برای باز کردن MetaMask از طریق Deep Linking */}
      <Link href="metamask://">
        <button
          className="absolute bottom-20 left-1/2 -translate-x-1/2 px-8 h-[2.875rem] rounded-full text-white text-[1.188rem] font-inter bg-gradient-to-b from-[#0d97c7] to-[#0a6486] hover:scale-105 transition duration-300"
        >
          Open MetaMask
        </button>
      </Link>
    </div>
  );
}
