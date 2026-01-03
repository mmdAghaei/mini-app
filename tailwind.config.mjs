/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {

                box1: {
                    "9%": { transform: "translate(-26px,0)" },
                    "36%": { transform: "translate(26px,0)" },
                    "45%": { transform: "translate(26px,26px)" },
                    "72%": { transform: "translate(26px,0)" },
                    "90%": { transform: "translate(-26px,0)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box2: {
                    "18%": { transform: "translate(26px,0)" },
                    "45%": { transform: "translate(26px,26px)" },
                    "81%": { transform: "translate(0,26px)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box3: {
                    "9%": { transform: "translate(-26px,0)" },
                    "81%": { transform: "translate(-26px,-26px)" },
                    "90%": { transform: "translate(0,-26px)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box4: {
                    "27%": { transform: "translate(-26px,-26px)" },
                    "36%": { transform: "translate(0,-26px)" },
                    "90%": { transform: "translate(-26px,0)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box5: {
                    "36%": { transform: "translate(26px,0)" },
                    "81%": { transform: "translate(26px,-26px)" },
                    "90%": { transform: "translate(0,-26px)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box6: {
                    "18%": { transform: "translate(-26px,0)" },
                    "72%": { transform: "translate(0,26px)" },
                    "81%": { transform: "translate(-26px,26px)" },
                    "90%": { transform: "translate(-26px,0)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box7: {
                    "9%": { transform: "translate(26px,0)" },
                    "45%": { transform: "translate(0,-26px)" },
                    "54%": { transform: "translate(26px,-26px)" },
                    "90%": { transform: "translate(26px,0)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box8: {
                    "27%": { transform: "translate(-26px,-26px)" },
                    "81%": { transform: "translate(26px,-26px)" },
                    "90%": { transform: "translate(26px,0)" },
                    "100%": { transform: "translate(0,0)" },
                },
                box9: {
                    "81%": { transform: "translate(-52px,0)" },
                    "90%": { transform: "translate(-26px,0)" },
                    "100%": { transform: "translate(0,0)" },
                },
            },
            animation: {
                box1: "box1 4s infinite",
                box2: "box2 4s infinite",
                box3: "box3 4s infinite",
                box4: "box4 4s infinite",
                box5: "box5 4s infinite",
                box6: "box6 4s infinite",
                box7: "box7 4s infinite",
                box8: "box8 4s infinite",
                box9: "box9 4s infinite",
            },
            fontFamily: {
                inter: ["var(--font-inter)"],
                orbitron: ["var(--font-orbitron)"],
            },
            colors: {
                gray: {
                    100: "#292528",
                    200: "#04080f",
                    300: "rgba(255,255,255,0.14)",
                    400: "rgba(255,255,255,0.7)",
                    500: "rgba(249,253,255,0.86)",
                    600: "rgba(0,0,0,0)",
                },
                white: "#fff",
                silver: {
                    100: "#c4c4c4",
                    200: "#c3c3c3",
                },
                darkgray: {
                    100: "#aeaeae",
                    200: "#a7a7a7",
                }, // ← این کاما خیلی مهمه
                black: "#000",
                gainsboro: "#d9d9d9",
                salmon: "#ff7373",
            },

        },
    },
    plugins: []
};

export default config;