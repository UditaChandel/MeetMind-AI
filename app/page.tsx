"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Mic, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { Upload, Sparkles, CheckCircle2 } from "lucide-react";
export default function LandingPage() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    return (
        <div className="min-h-screen bg-black text-white">

            {/* HERO */}
            <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT */}
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                        Turn messy meetings into{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                            clear decisions
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Upload audio or paste notes — get summaries, key points, and
                        actionable tasks in seconds.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                if (!isLoaded) return;

                                if (!isSignedIn) {
                                    router.push("/sign-in?redirect_url=/dashboard");
                                } else {
                                    router.push("/dashboard");
                                }
                            }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition flex items-center gap-2"
                        >
                            Get Started <ArrowRight size={16} />
                        </button>


                    </div>
                </div>

                {/* RIGHT (Preview Card) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
                    <p className="text-sm text-gray-400 mb-2">AI Output Preview</p>

                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-300 font-medium">Summary</p>
                            <p className="text-gray-500">
                                Team discussed product launch timeline and feature readiness.
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-300 font-medium">Key Points</p>
                            <ul className="text-gray-500 space-y-1">
                                <li>• Frontend almost complete</li>
                                <li>• Backend integration pending</li>
                                <li>• Marketing starts next week</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-gray-300 font-medium">Tasks</p>
                            <ul className="text-gray-500 space-y-1">
                                <li>✔ Finalize UI</li>
                                <li>✔ Complete API integration</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 💎 FEATURES */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-6">

                    <FeatureCard
                        icon={<Brain className="text-purple-400" />}
                        title="Smart Summaries"
                        desc="Convert long meetings into clear, concise summaries instantly."
                    />

                    <FeatureCard
                        icon={<Mic className="text-purple-400" />}
                        title="Audio + Notes"
                        desc="Upload recordings or paste notes — works seamlessly with both."
                    />

                    <FeatureCard
                        icon={<CheckCircle className="text-purple-400" />}
                        title="Actionable Tasks"
                        desc="Automatically generate tasks with priorities so nothing is missed."
                    />
                </div>
            </section>
            <div className="flex justify-center mt-6 animate-bounce text-gray-500 text-sm">
                ↓ See how it works
            </div>
            {/* ⚡ HOW IT WORKS */}
            {/* ⚡ HOW IT WORKS (REDESIGNED) */}

            <section className="max-w-6xl mx-auto px-6 py-10">
                {/* HEADER */}
                <div className="mb-12 max-w-3xl">
                    <p className="text-s tracking-[0.14em] uppercase text-purple-400 mb-3">
                        How it works
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
                        From messy notes to clear actions
                    </h2>

                    <p className="text-gray-400 text-sm">
                        Three steps. No setup. Your meetings finally mean something after they end.
                    </p>
                </div>

                {/* STEPS */}
                <div className="flex items-center justify-center">

                    <StepCard
                        number="01"
                        title="Drop in your content"
                        desc="Audio recording, raw transcript, or scattered notes — paste it in any format, no cleanup needed."
                        tag="Supports audio · text · PDF"
                        icon={<Upload size={18} />}
                    />

                    <Connector />

                    <StepCard
                        number="02"
                        title="AI understands context"
                        desc="Understands discussions, decisions, blockers, and what still needs ownership."
                        tag="Context-aware analysis"
                        icon={<Sparkles size={18} />}
                        highlight
                    />

                    <Connector />

                    <StepCard
                        number="03"
                        title="Get structured output"
                        desc="Summary, key decisions, open questions, and action items ready to share."
                        tag="Export to Notion · Slack · Email"
                        icon={<CheckCircle2 size={18} />}
                    />

                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-3 mt-12 border  border-white/10 rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10">

                    <Stat num="4.2" suffix="×" label="faster meeting follow-ups" />
                    <Stat num="25k" suffix="+" label="words processed per meeting" />
                    <Stat num="98" suffix="%" label="action item capture rate" />

                </div>



                {/* CTA */}
                <div className="mt-8 text-center relative">

                    {/* glow */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_70%)]" />

                    <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                        Start with your next meeting
                    </h3>

                    <p className="text-gray-400 text-sm mb-6">
                        No credit card. No setup. Works in 30 seconds.
                    </p>

                    <button
                        onClick={() => {
                            if (!isLoaded) return; // ⛔ wait for Clerk

                            if (!isSignedIn) {
                                router.push("/sign-in?redirect_url=/dashboard");
                            } else {
                                router.push("/dashboard");
                            }
                        }}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition"
                    >
                        Get Started
                    </button>

                </div>

            </section>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition">
            <div className="mb-4">{icon}</div>
            <h3 className="text-white font-medium mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    );
}
function Connector() {
    return (
        <div className="flex items-center mx-3">

            {/* dots */}
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* arrow */}
            <div className="ml-2 text-purple-400 text-sm">
                →
            </div>
        </div>
    );
}
function StepCard({
    number,
    title,
    desc,
    tag,
    icon,
    highlight = false,
}: {
    number: string;
    title: string;
    desc: string;
    tag: string;
    icon: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <div
            className={`
        relative w-[280px] min-h-[240px] flex flex-col justify-between
        rounded-2xl p-6 backdrop-blur-xl transition
        border bg-white/5
        ${highlight
                    ? "border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
                    : "border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10"
                }
    `}
        >



            {/* Top Row */}
            <div className="flex items-center justify-between mb-5">
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {number}
                </span>

                <div className="text-purple-400">
                    {icon}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-medium mb-3 leading-snug">
                {title}
            </h3>

            {/* Desc */}
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                {desc}
            </p>

            {/* Tag */}
            <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 w-fit">
                {tag}
            </div>

        </div>
    );
}
function Stat({
    num,
    suffix,
    label,
}: {
    num: string;
    suffix: string;
    label: string;
}) {
    return (
        <div className="p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold text-white mb-1">
                {num}
                <span className="text-purple-400">{suffix}</span>
            </div>

            <div className="text-sm text-gray-400">
                {label}
            </div>
        </div>
    );
}