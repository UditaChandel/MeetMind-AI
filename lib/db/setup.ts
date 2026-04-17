import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function setupDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS meetings (
      id SERIAL PRIMARY KEY,
      userId TEXT,
      transcript TEXT,
      userNotes TEXT,
      summary TEXT,
      keypoints TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      meetingId INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
      task TEXT NOT NULL,
      priority TEXT,
      deadline TEXT,
      status TEXT DEFAULT 'todo'
    );
  `;

  console.log("✅ Tables created successfully");
}