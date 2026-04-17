import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
export const metadata: Metadata = {
    title: "MeetMind AI",
    description: "AI Meeting Intelligence Platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            appearance={{
                theme: dark,
                variables: {
                    colorPrimary: "#8b5cf6",
                    colorBackground: "#000000",
                    colorInputBackground: "#111111",
                    colorInputText: "#ffffff",
                    colorText: "#ffffff",
                },
                elements: {
                    card: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton:
                        "bg-white/10 border border-white/10 hover:bg-white/20 text-white",
                    formButtonPrimary:
                        "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90",
                    footerActionText: "text-gray-400",
                    footerActionLink: "text-purple-400 hover:text-purple-300",
                },
            }}
        >

            <html lang="en">
                <body>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </body>
            </html>
        </ClerkProvider>
    );
}
