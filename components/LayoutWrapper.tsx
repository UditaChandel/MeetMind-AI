"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";
    const isAuthPage =
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up");
    const { signOut } = useClerk();
    const hideSidebar = isLandingPage || isAuthPage;
    if (hideSidebar) {

        return <>{children}</>;

    }
    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">

            {!hideSidebar && (
                <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 p-6 flex flex-col justify-between bg-black">

                    {/* TOP */}
                    <div>
                        <h1 className="text-xl font-semibold text-purple-400 mb-8">
                            MeetMind
                        </h1>

                        <nav className="space-y-2 text-sm">

                            <Link
                                href="/dashboard"
                                className={`block px-4 py-2 rounded-lg transition ${pathname === "/dashboard"
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/analyze"
                                className={`block px-4 py-2 rounded-lg transition ${pathname === "/analyze"
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                Analyze Meeting
                            </Link>

                        </nav>
                    </div>

                    {/* 🔥 USER SECTION (BOTTOM) */}
                    <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center gap-3">

                            {/* avatar */}
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                                U
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-white">Udita</p>
                                <p className="text-xs text-gray-400 truncate">
                                    uditachandel8@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* logout */}
                        <button
                            onClick={async () => {
                                await signOut();
                                window.location.href = "/";
                            }}
                            className="mt-4 w-full text-sm text-red-400 hover:text-red-300 transition"
                        >
                            Logout
                        </button>
                    </div>

                </aside>
            )}

            <main className="flex-1 ml-64 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}