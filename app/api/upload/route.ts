import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        //  No file
        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        //  Validate type
        const validTypes = ["audio/mpeg", "audio/wav"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: "Invalid file type" },
                { status: 400 }
            );
        }

        //  Validate size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: "File too large (max 10MB)" },
                { status: 400 }
            );
        }

        //  Convert to buffer (for next steps)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        //  For now we don't store, just simulate success
        return NextResponse.json({
            success: true,
            data: {
                name: file.name,
                size: file.size,
                type: file.type,
                // later we’ll pass buffer to transcription
            },
        });
    } catch (error) {
        console.error("Upload error:", error);

        return NextResponse.json(
            { success: false, message: "Upload failed" },
            { status: 500 }
        );
    }
}