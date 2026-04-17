"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}
                <div className="space-y-8">

                    <h1 className="text-5xl font-semibold leading-tight">
                        Turn messy meetings into{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                            clear decisions
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg">
                        AI-powered summaries, key points, and action items — instantly.
                    </p>


                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">

                        <p className="text-sm text-gray-400">AI Output Preview</p>

                        <div>
                            <p className="text-gray-300 font-medium">Summary</p>
                            <p className="text-gray-500 text-sm">
                                Team discussed product launch timeline and pending backend work.
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-300 font-medium">Key Points</p>
                            <ul className="text-gray-500 text-sm space-y-1">
                                <li>• Frontend almost done</li>
                                <li>• API integration pending</li>
                                <li>• Launch next week</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-gray-300 font-medium">Tasks</p>
                            <ul className="text-gray-500 text-sm space-y-1">
                                <li>✔ Complete backend</li>
                                <li>✔ Final UI polish</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="relative flex justify-center items-start w-full">

                    {/* glow behind */}
                    <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full -z-10" />

                    {/*  WRAP CLERK */}
                    <div className="min-h-screen bg-black text-white flex items-start justify-center px-6 py-10">
                        <SignUp
                            appearance={{
                                elements: {
                                    card: "w-full shadow-none bg-transparent",
                                },
                            }}
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}