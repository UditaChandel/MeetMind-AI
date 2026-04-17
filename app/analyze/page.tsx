"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";

export default function AnalyzePage() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [notes, setNotes] = useState("");
    const [appState, setAppState] = useState<
        "idle" | "uploading" | "analyzing" | "done" | "error"
    >("idle");
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        try {
            setError("");

            if (!file && !notes.trim()) {
                setError("Please provide audio or notes");
                return;
            }

            setAppState("uploading");

            const formData = new FormData();

            if (file) formData.append("file", file);
            if (notes) formData.append("notes", notes);

            const res = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            setAppState("analyzing");

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to analyze");
            }

            setAppState("done");

            // redirect
            router.push(`/meeting/${data.data.meeting.id}`);
        } catch (err: any) {
            setAppState("error");
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

            {/* Title */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                    Analyze Meeting
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Upload audio, add notes, or combine both
                </p>
            </div>

            {/* Upload */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md">
                <FileUpload onFileSelect={setFile} />
            </div>

            {/* Notes */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md">
                <textarea
                    placeholder="Paste meeting notes (optional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-40 bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-500 resize-none"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Button */}
            <button
                onClick={handleAnalyze}
                disabled={appState !== "idle"}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {appState === "idle" && "Analyze Meeting"}

                {appState === "uploading" && (
                    <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Processing...
                    </>
                )}

                {appState === "analyzing" && (
                    <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Analyzing...
                    </>
                )}

                {appState === "done" && "Done"}
            </button>
            {appState === "analyzing" && (
                <p className="text-xs text-gray-500 text-center">
                    AI is analyzing your meeting...
                </p>
            )}
        </div>
    );
}