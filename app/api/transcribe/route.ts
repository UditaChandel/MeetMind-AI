import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        // Convert file → buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        //  Step 1: Upload audio to AssemblyAI
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

        //  Step 2: Request transcription
        const transcriptRes = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            {
                audio_url: audioUrl,
            },
            {
                headers: {
                    authorization: process.env.ASSEMBLYAI_API_KEY!,
                },
            }
        );

        const transcriptId = transcriptRes.data.id;

        //  Step 3: Poll for completion
        let transcriptText = "";
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
                transcriptText = polling.data.text;
            }

            if (status === "error") {
                throw new Error("Transcription failed");
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                transcript: transcriptText,
            },
        });
    } catch (error) {
        console.error("Transcription error:", error);

        return NextResponse.json(
            { success: false, message: "Transcription failed" },
            { status: 500 }
        );
    }
}