/**
 * Combines audio transcript + user notes into one structured input
 * This is what gets sent to Gemini
 */

export function mergeInput({
    transcript,
    userNotes,
}: {
    transcript?: string | null;
    userNotes?: string | null;
}) {

    if (!transcript && !userNotes) {
        throw new Error("No input provided");
    }


    if (transcript && !userNotes) {
        return `Transcript:
${transcript}`;
    }

    if (!transcript && userNotes) {
        return `User Notes:
${userNotes}`;
    }

    return `Transcript:
${transcript}

User Notes:
${userNotes}`;
}