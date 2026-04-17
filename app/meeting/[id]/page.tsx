"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
type Task = {
    id: number;
    task: string;
    priority: string;
    status: string;

};

type Meeting = {
    id: number;
    transcript: string;
    summary: string;
    keypoints: string;
    displayIndex?: number;
};

export default function MeetingDetail({ params }: { params: { id: string } }) {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const meetingRes = await axios.get("/api/meetings");

                const allMeetings = meetingRes.data.data;


                const sorted = allMeetings.sort(
                    (a: any, b: any) =>
                        new Date(a.createdat).getTime() - new Date(b.createdat).getTime()
                );


                const foundIndex = sorted.findIndex(
                    (m: any) => m.id === Number(params.id)
                );

                const foundMeeting = sorted[foundIndex];

                setMeeting({
                    ...foundMeeting,
                    displayIndex: foundIndex + 1,
                });

                const tasksRes = await axios.get(
                    `/api/tasks?meetingId=${params.id}`
                );

                setTasks(tasksRes.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
                Loading insights...
            </div>
        );
    }

    if (!meeting) {
        return <div className="text-gray-400">Meeting not found</div>;
    }
    const parsedKeypoints = meeting.keypoints
        ? JSON.parse(meeting.keypoints)
        : [];
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-4 py-10 space-y-8"
        >

            {/* Header */}
            <div>
                <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                    Meeting #{meeting.displayIndex}
                </h1>
                <p className="text-gray-400 mt-2 text-sm">
                    AI-generated insights and structured actions
                </p>
            </div>

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md hover:border-white/20 transition hover:shadow-lg">
                <h2 className="text-lg font-medium text-gray-200 mb-3">
                    Summary
                </h2>
                <p className="text-gray-400 leading-relaxed">
                    {meeting.summary}
                </p>
            </div>
            {parsedKeypoints.length > 0 && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md">
                    <h2 className="text-lg font-medium text-gray-200 mb-3">
                        Key Points
                    </h2>

                    <ul className="space-y-2">
                        {parsedKeypoints.map((point: string, i: number) => (
                            <li key={i} className="text-gray-300 text-sm">
                                • {point}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Tasks */}
            {tasks.length > 0 && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md hover:border-white/20 transition hover:shadow-lg">
                    <h2 className="text-lg font-medium text-gray-200 mb-4">
                        Action Items
                    </h2>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={async () => {
                                    const newStatus =
                                        task.status === "done" ? "todo" : "done";

                                    try {
                                        await axios.patch(`/api/tasks/${task.id}`, {
                                            status: newStatus,
                                        });

                                        setTasks((prev) =>
                                            prev.map((t) =>
                                                t.id === task.id
                                                    ? { ...t, status: newStatus }
                                                    : t
                                            )
                                        );
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition ${task.status === "done"
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-black/40 border-white/10 hover:bg-black/60"
                                    }`}
                            >
                                <span
                                    className={`text-sm ${task.status === "done"
                                        ? "line-through text-gray-500"
                                        : "text-gray-200"
                                        }`}
                                >
                                    {task.task}
                                </span>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full font-medium ${task.priority === "High"
                                        ? "bg-red-500/20 text-red-400"
                                        : task.priority === "Medium"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-green-500/20 text-green-400"
                                        }`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transcript */}
            {meeting.transcript && meeting.transcript.trim() !== "" && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md hover:border-white/20 transition hover:shadow-lg">
                    <h2 className="text-lg font-medium text-gray-200 mb-3">
                        Transcript
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {meeting.transcript}
                    </p>
                </div>
            )}

        </motion.div>
    );
}