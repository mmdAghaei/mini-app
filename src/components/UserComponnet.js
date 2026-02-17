"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        photoUrl: "",
        firstName: "",
        lastName: "",
        id: "",
        username: "",
        languageCode: "",
    });

    useEffect(() => {
        let intervalId = null;

        const tryReadTelegram = () => {
            const webApp = window?.Telegram?.WebApp;
            if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
                const {
                    photo_url,
                    first_name,
                    last_name,
                    id,
                    username,
                    language_code
                } = webApp.initDataUnsafe.user;

                setUserData({
                    photoUrl: photo_url || "",
                    firstName: first_name || "",
                    lastName: last_name || "",
                    id: id || "",
                    username: username || "",
                    languageCode: language_code || "",
                });

                // optional: tell Telegram we're ready
                try { webApp.ready && webApp.ready(); } catch (e) { /* ignore */ }

                return true;
            }
            return false;
        };

        // یکبار تلاش کن
        if (!tryReadTelegram()) {
            // اگر نبود هر 300ms چک کن تا پیدا شه (تا وقتی پیدا شد پاکش می‌کنیم)
            intervalId = setInterval(() => {
                if (tryReadTelegram() && intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }, 300);
        }

        // در محیط توسعه اگر توی مرورگر معمولی اجرا می‌کنی، یه mock بذار برای تست UI
        if (process.env.NODE_ENV === 'development' && !window?.Telegram) {
            setUserData(prev => ({
                ...prev,
                photoUrl: "https://i.pravatar.cc/150?img=3",
                firstName: "Mohammad",
                lastName: "Aghaei",
                id: "12345",
                username: "mmahdi",
                languageCode: "fa"
            }));
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
