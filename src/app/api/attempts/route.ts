// src/app/api/attempts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreAttempt } from "@/lib/score";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const questionId = Number(body?.questionId);
        const answer = String(body?.answer ?? "").trim();

        if (!questionId || !Number.isInteger(questionId)) {
            return NextResponse.json({ error: "Invalid questionId" }, { status: 400 });
        }
        if (!answer) {
            return NextResponse.json({ error: "Answer is required" }, { status: 400 });
        }

        // Ensure question exists and get its text for scoring
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            select: { id: true, text: true },
        });
        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        // 1) Save the attempt
        const attempt = await prisma.attempt.create({
            data: { questionId, answer },
            select: { id: true, questionId: true, answer: true, createdAt: true },
        });

        // 2) Score with LLM (or heuristic if no key)
        const scored = await scoreAttempt(question.text, answer);

        // 3) Persist the score
        const savedScore = await prisma.score.create({
            data: {
                attemptId: attempt.id,
                value: scored.value,
                rationale: scored.rationale,
                rubric: scored.rubric as any,
            },
            select: { id: true, value: true, rationale: true, rubric: true, createdAt: true },
        });

        // 4) Return attempt + score
        return NextResponse.json({ data: { attempt, score: savedScore } }, { status: 201 });
    } catch (err) {
        console.error("POST /api/attempts error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function HEAD() {
    return new Response(null, { status: 200 });
}
