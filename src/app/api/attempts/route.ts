// src/app/api/attempts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

        // verify the question exists
        const exists = await prisma.question.findUnique({ where: { id: questionId } });
        if (!exists) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        const attempt = await prisma.attempt.create({
            data: { questionId, answer },
            select: { id: true, questionId: true, answer: true, createdAt: true },
        });

        return NextResponse.json({ data: attempt }, { status: 201 });
    } catch (err) {
        console.error("POST /api/attempts error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Optional: handle HEAD prefetches gracefully
export async function HEAD() {
    return new Response(null, { status: 200 });
}
