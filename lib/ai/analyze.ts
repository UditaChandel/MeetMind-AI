import { model } from "./gemini";

type ActionItem = {
    task: string;
    priority: "High" | "Medium" | "Low";
    deadline?: string | null;
    assignee?: string | null;
};

type AnalysisResult = {
    summary: string;
    key_points: string[];
    action_items: ActionItem[];
};

export async function analyzeMeeting(input: string): Promise<AnalysisResult> {
    console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
    try {
        const prompt = `
You are an AI meeting assistant.

Analyze the given meeting content and return ONLY valid JSON.

STRICT RULES:
- Output MUST be in English only
- Do NOT include any explanation or extra text
- Follow the exact schema below
- If no data is available, return empty arrays or null

Schema:
{
  "summary": "string",
  "key_points": ["string"],
  "action_items": [
    {
      "task": "string",
      "priority": "High | Medium | Low",
      "deadline": "string or null",
      "assignee": "string or null"
    }
  ]
}

Rules:
- Keep summary concise (2–4 lines)
- Extract 3–6 key points
- Action items must be clear and actionable
- Priority must ONLY be: High, Medium, or Low
- Do not invent deadlines or assignees if not mentioned

Content:
${input}
`;

        const result = await model.generateContent(prompt);

        const text = result.response.text();

        console.log("RAW GEMINI RESPONSE:", text); // debug

        // ✅ Extract JSON safely
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("Invalid JSON response");
        }

        const jsonString = text.slice(start, end + 1);

        const parsed: AnalysisResult = JSON.parse(jsonString);

        return parsed;
    } catch (error) {
        console.error("❌ Gemini Analyze error:", error);
        throw new Error("Failed to analyze meeting");
    }
}