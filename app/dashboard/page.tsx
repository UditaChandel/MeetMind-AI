"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
type Meeting = {
    id: number;
    summary: string;
    createdat: string;
};

export default function Dashboard() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const sortedMeetings = [...meetings].sort(
        (a, b) =>
            new Date(a.createdat).getTime() -
            new Date(b.createdat).getTime()
    );
    //  HANDLE REDIRECT INSIDE useEffect
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    //  FETCH DATA (ONLY IF USER EXISTS)
    useEffect(() => {
        if (!user) return;

        async function fetchMeetings() {
            try {
                const res = await axios.get("/api/meetings");
                setMeetings(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchMeetings();
    }, [user]);

    if (!isLoaded) {
        return (
            <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">

                {/* Header skeleton */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
                        <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                    </div>

                    <div className="h-10 w-36 bg-white/10 rounded-xl animate-pulse" />
                </div>

                {/* Cards skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>

            </div>
        );
    }

    if (!isSignedIn) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10 max-w-6xl mx-auto px-6 py-10"
        >

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                        Dashboard
                    </h1>

                    <p className="text-gray-400 mt-2 text-xl">
                        Welcome {user?.firstName || "User"}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/analyze">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-sm font-semibold hover:opacity-90 transition shadow-lg flex items-center gap-2">
                            <Plus size={16} />
                            New Analysis
                        </button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">

                {loading ? (
                    //  ONLY cards skeleton
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 overflow-hidden"
                            >

                                {/* shimmer */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                {/* top */}
                                <div className="flex justify-between mb-4">
                                    <div className="h-3 w-16 bg-white/10 rounded" />
                                    <div className="h-3 w-12 bg-white/10 rounded" />
                                </div>

                                {/* content */}
                                <div className="space-y-2">
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                    <div className="h-3 bg-white/10 rounded w-5/6" />
                                    <div className="h-3 bg-white/10 rounded w-3/4" />
                                </div>

                                {/* footer */}
                                <div className="mt-6 h-3 w-24 bg-white/10 rounded" />

                            </div>
                        ))}

                    </div>
                ) : meetings.length === 0 ? (

                    <div className="text-gray-500 text-sm border border-white/10 rounded-xl p-6 bg-white/5">
                        No meetings yet. Start by analyzing your first meeting.
                    </div>
                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedMeetings.map((meeting, index) => (
                            <Link key={meeting.id} href={`/meeting/${meeting.id}`}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 hover:border-white/20 transition cursor-pointer"
                                >
                                    <div className="flex justify-between mb-3">
                                        <span className="text-xs text-gray-500">
                                            Meeting #{index + 1}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                            {new Date(meeting.createdat).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-300 line-clamp-3">
                                        {meeting.summary}
                                    </p>

                                    <div className="mt-4 text-xs text-gray-500 group-hover:text-gray-300">
                                        View details →
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </motion.div>
    );
}