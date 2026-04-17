import { NextResponse } from "next/server";
import { getTasksByMeeting } from "@/lib/db/queries/tasks";


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const meetingId = searchParams.get("meetingId");

        if (!meetingId) {
            return NextResponse.json(
                { success: false, message: "meetingId is required" },
                { status: 400 }
            );
        }

        const tasks = await getTasksByMeeting(Number(meetingId));

        return NextResponse.json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        console.error("GET tasks error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}