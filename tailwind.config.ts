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

                "card-border": "#e2e2e2",
                "card-tag-bg": "#f0f0f0",
                "card-tag-text": "#444444",
                "card-desc": "#666666",

                "cli-accent": "#1D9E75",
                "cli-badge-bg": "#E1F5EE",
                "cli-badge-text": "#0F6E56",

                "api-accent": "#378ADD",
                "api-badge-bg": "#E6F1FB",
                "api-badge-text": "#185FA5",

                "web-accent": "#7F77DD",
                "web-badge-bg": "#EEEDFE",
                "web-badge-text": "#534AB7",
            },
            boxShadow: {
                "snap-glow": "inset 0 0 20px rgba(255, 255, 255, 0.2)",

                "card-cli": "inset 0 3px 0 #1D9E75",
                "card-api": "inset 0 3px 0 #378ADD",
                "card-web": "inset 0 3px 0 #7F77DD",
                "card-cli-hover":
                    "inset 0 3px 0 #1D9E75, 0 4px 16px rgba(0,0,0,0.08)",
                "card-api-hover":
                    "inset 0 3px 0 #378ADD, 0 4px 16px rgba(0,0,0,0.08)",
                "card-web-hover":
                    "inset 0 3px 0 #7F77DD, 0 4px 16px rgba(0,0,0,0.08)",
            },
        },
    },
    plugins: [],
};

export default config;
