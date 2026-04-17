import { NextResponse } from "next/server";
import axios from "axios";
import { mergeInput } from "@/lib/utils/mergeInput";
import { analyzeMeeting } from "@/lib/ai/analyze";
import { createMeeting } from "@/lib/db/queries/meetings";
import { createTasks } from "@/lib/db/queries/tasks";
import { auth } from "@clerk/nextjs/server";
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const file = formData.get("file") as File | null;
        const userNotes = formData.get("notes") as string | null;

        let transcript: string | null = null;

        //  STEP 1 → If audio exists → transcribe using AssemblyAI
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to AssemblyAI
            const uploadRes = await axios.post(
                "https://api.assemblyai.com/v2/upload",
                buffer,
                {
                    headers: {
                        authorization: process.env.ASSEMBLYAI_API_KEY!,
                        "content-type": "application/octet-stream",
                    },
                }
            );

            const audioUrl = uploadRes.data.upload_url;

            // Request transcription
            const transcriptRes = await axios.post(
                "https://api.assemblyai.com/v2/transcript",
                {
                    audio_url: audioUrl,
                    speech_models: ["universal-2"],
                },
                {
                    headers: {
                        authorization: process.env.ASSEMBLYAI_API_KEY!,
                    },
                }
            );

            const transcriptId = transcriptRes.data.id;

            // Poll
            let status = "processing";

            while (status !== "completed") {
                await new Promise((res) => setTimeout(res, 2000));

                const polling = await axios.get(
                    `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                    {
                        headers: {
                            authorization: process.env.ASSEMBLYAI_API_KEY!,
                        },
                    }
                );

                status = polling.data.status;

                if (status === "completed") {
                    transcript = polling.data.text;
                }

                if (status === "error") {
                    throw new Error("Transcription failed");
                }
            }
        }

        //  STEP 2 → Merge input
        const finalInput = mergeInput({
            transcript,
            userNotes,
        });

        //  STEP 3 → Gemini analysis
        const analysis = await analyzeMeeting(finalInput);
        console.log("FULL ANALYSIS:", analysis);
        console.log("KEY POINTS:", analysis.key_points);
        //  STEP 4 → Save meeting
        const meeting = await createMeeting({
            userId,
            transcript: transcript || "",
            userNotes: userNotes || "",
            summary: analysis.summary,
            keypoints: JSON.stringify(analysis.key_points),
        });

        //  STEP 5 → Save tasks
        const tasks = await createTasks(
            meeting.id,
            analysis.action_items
        );

        // FINAL RESPONSE
        return NextResponse.json({
            success: true,
            data: {
                meeting,
                analysis,
                tasks,
            },
        });
    } catch (error) {
        console.error("Analyze API error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to analyze meeting",
            },
            { status: 500 }
        );
    }
}