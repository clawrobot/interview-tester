// src/app/api/questions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    const questions = await prisma.question.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ data: questions });
}

// Some environments send HEAD for prefetch. Return 200 with no body.
export async function HEAD() {
    return new Response(null, { status: 200 });
}
