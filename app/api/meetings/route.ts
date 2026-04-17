import { NextResponse } from "next/server";
import { createMeeting, getMeetingsByUser } from "@/lib/db/queries/meetings";
import { auth } from "@clerk/nextjs/server";


export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const meetings = await getMeetingsByUser(userId);

        return NextResponse.json({
            success: true,
            data: meetings,
        });
    } catch (error) {
        console.error("GET meetings error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch meetings" },
            { status: 500 }
        );
    }
}

