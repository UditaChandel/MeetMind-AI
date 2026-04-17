import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1",
                secondary: "#22c55e",
                danger: "#ef4444"
            }
        }
    },
    plugins: []
};

export default config;