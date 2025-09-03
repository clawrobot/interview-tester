// src/lib/score.ts
import OpenAI from "openai";

type ScoreResult = {
    value: number;         // 0..100
    rationale: string;     // short explanation
    rubric?: Record<string, unknown>;
};

const client =
    process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function heuristicScore(answer: string, note?: string): ScoreResult {
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    const lengthScore = Math.max(0, Math.min(100, Math.round((words / 150) * 100))); // ~150 words ideal
    const value = Math.round(lengthScore * 0.7 + 30); // bias slightly positive
    return {
        value: Math.max(0, Math.min(100, value)),
        rationale:
            note ??
            "Heuristic score: mostly based on length and completeness. Add OPENAI_API_KEY and credits for real LLM grading.",
        rubric: { words },
    };
}

export async function scoreAttempt(question: string, answer: string): Promise<ScoreResult> {
    // If no client (no API key), heuristic
    if (!client) return heuristicScore(answer);

    const system = `
You are an interview coach and strict grader. Score answers from 0-100 using this rubric:
- Relevance & focus (0-25)
- Structure & clarity (0-20)
- Specificity & examples (0-25)
- Communication (0-20)
- Length & completeness (0-10, 120-250 words ideal)

Return ONLY JSON:
{
  "score": <0-100>,
  "rationale": "<2-4 sentences>",
  "rubric": {
    "relevance": 0-25,
    "structure": 0-20,
    "specificity": 0-25,
    "communication": 0-20,
    "lengthCompleteness": 0-10
  }
}
`.trim();

    const user = `
Question: ${question}

Candidate answer:
"""
${answer}
"""
`.trim();

    try {
        const resp = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });

        const content = resp.choices?.[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(content);

        const rawScore = Number(parsed?.score);
        const value = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0;

        return {
            value,
            rationale: String(parsed?.rationale ?? "").slice(0, 1200),
            rubric: parsed?.rubric,
        };
    } catch (err: any) {
        // Log and fallback instead of throwing
        console.error("scoreAttempt OpenAI error:", {
            status: err?.status,
            type: err?.error?.type,
            message: err?.message,
        });
        const codeText = [err?.status, err?.error?.type].filter(Boolean).join(" ");
        return heuristicScore(
            answer,
            `Heuristic fallback because model call failed${codeText ? ` (${codeText})` : ""}.`
        );
    }
}
