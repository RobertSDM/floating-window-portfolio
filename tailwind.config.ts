import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "snap-fill": "rgba(100, 180, 255, 0.3)",
                "snap-border": "rgba(70, 140, 255, 0.5)",

                "titlebar-bg": "#2a2a2e",
                "titlebar-border": "rgba(255, 255, 255, 0.12)",
                "titlebar-title": "rgba(255, 255, 255, 0.75)",

                "window-body-bg": "#1e1e22",
                "window-border": "rgba(255, 255, 255, 0.08)",

                "btn-close": "#FF5F57",
                "btn-minimize": "#FEBC2E",
                "btn-fullscreen": "#28C840",
                "btn-icon": "rgba(0, 0, 0, 0.55)",
            },
            boxShadow: {
                "snap-glow": "inset 0 0 20px rgba(255, 255, 255, 0.2)",
            },
        },
    },
    plugins: [],
};

export default config;
