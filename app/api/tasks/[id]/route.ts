import { NextResponse } from "next/server";
import { updateTaskStatus } from "@/lib/db/queries/tasks";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { status } = body;

        const updated = await updateTaskStatus(
            Number(params.id),
            status
        );

        return NextResponse.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error("Update task error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update task" },
            { status: 500 }
        );
    }
}