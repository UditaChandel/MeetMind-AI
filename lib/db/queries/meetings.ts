import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function createMeeting(data: {
  userId: string;
  transcript: string;
  userNotes?: string;
  summary?: string;
  keypoints?: string;
}) {
  const result = await sql`
    INSERT INTO meetings (userId, transcript, userNotes, summary, keypoints)
    VALUES (
      ${data.userId},
      ${data.transcript},
      ${data.userNotes ?? ""},
      ${data.summary ?? ""},
      ${data.keypoints ?? ""}
    )
    RETURNING *;
  `;

  return result[0];
}


export async function getMeetingsByUser(userId: string) {
  const result = await sql`
    SELECT * FROM meetings
    WHERE userId = ${userId}
    ORDER BY createdAt DESC;
  `;

  return result;
}


export async function getMeetingById(id: number, userId: string) {
  const result = await sql`
    SELECT * FROM meetings
    WHERE id = ${id} AND userId = ${userId};
  `;

  return result[0];
}