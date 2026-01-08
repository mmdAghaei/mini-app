"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

// مدل گلوبال برای ذخیره اطلاعات کاربر
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
        if (typeof window !== "undefined" && window.Telegram) {
            const webApp = window.Telegram.WebApp;
            if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
                const {
                    photo_url,
                    first_name,
                    last_name,
                    id,
                    username,
                    language_code
                } = webApp.initDataUnsafe.user;

                // ذخیره تمام اطلاعات کاربر در state
                setUserData({
                    photoUrl: photo_url || "",
                    firstName: first_name || "",
                    lastName: last_name || "",
                    id: id || "",
                    username: username || "",
                    languageCode: language_code || "",
                });
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
