/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ["var(--font-inter)"],
                orbitron: ["var(--font-orbitron)"],
            },
            colors: {
                "gray": {
                    "100": "#292528",
                    "200": "#04080f",
                    "300": "rgba(255, 255, 255, 0.14)",
                    "400": "rgba(255, 255, 255, 0.7)",
                    "500": "rgba(249, 253, 255, 0.86)",
                    "600": "rgba(0, 0, 0, 0)"
                },
                "white": "#fff",
                "silver": {
                    "100": "#c4c4c4",
                    "200": "#c3c3c3"
                },
                "darkgray": {
                    "100": "#aeaeae",
                    "200": "#a7a7a7"
                },
                "black": "#000",
                "gainsboro": "#d9d9d9",
                "salmon": "#ff7373"
            },

        },
    },
    plugins: [],
};
