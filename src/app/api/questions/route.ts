// src/app/api/questions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const questions = await prisma.question.findMany({
            orderBy: { id: "asc" },
            // select: { id: true, text: true } // optional: limit fields
        });
        return NextResponse.json({ data: questions });
    } catch (err) {
        console.error("GET /api/questions error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
