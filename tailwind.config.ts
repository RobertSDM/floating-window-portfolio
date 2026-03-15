import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "snap-fill": "rgba(100, 180, 255, 0.15)",
                "snap-border": "rgba(70, 140, 255, 0.5)",
            },
            boxShadow: {
                "snap-glow": "inset 0 0 20px rgba(255, 255, 255, 0.2)",
            },
        },
    },
    plugins: [],
};

export default config;
