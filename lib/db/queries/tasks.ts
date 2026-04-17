import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);


export async function createTasks(
    meetingId: number,
    tasks: {
        task: string;
        priority?: string;
        deadline?: string | null;
    }[]
) {
    const results = [];

    for (const t of tasks) {
        const res = await sql`
      INSERT INTO tasks (meetingId, task, priority, deadline)
      VALUES (${meetingId}, ${t.task}, ${t.priority ?? "Medium"}, ${t.deadline ?? null})
      RETURNING *;
    `;

        results.push(res[0]);
    }

    return results;
}
export async function updateTaskStatus(
    taskId: number,
    status: string
) {
    const result = await sql`
    UPDATE tasks
    SET status = ${status}
    WHERE id = ${taskId}
    RETURNING *;
  `;

    return result[0];
}

export async function getTasksByMeeting(meetingId: number) {
    const result = await sql`
    SELECT * FROM tasks
    WHERE meetingId = ${meetingId}
    ORDER BY id DESC;
  `;

    return result;
}