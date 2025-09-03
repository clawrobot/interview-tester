// src/components/PracticeForm.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import MicAnswer from "@/components/MicAnswer";

type Question = { id: number; text: string };

export default function PracticeForm({ questions }: { questions: Question[] }) {
    const [questionId, setQuestionId] = useState<number>(
        questions.length ? questions[0].id : 0
    );
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState<string>("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const res = await fetch("/api/attempts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId, answer }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.error ?? `HTTP ${res.status}`);
            }

            const data = await res.json();
            // data.data.score.value, data.data.score.rationale
            setStatus("success");
            setMessage(
                `✅ Saved attempt #${data?.data?.attempt?.id}\n\n` +
                `Score: ${data?.data?.score?.value}/100\n\n` +
                `${data?.data?.score?.rationale}`
            );
            setAnswer("");
        } catch (err: any) {
            setStatus("error");
            setMessage(err?.message ?? "Something went wrong.");
        }
    }

    return (
        <Card className="border">
            <CardContent className="space-y-4 p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        {/* Native select keeps things simple for now */}
                        <select
                            id="question"
                            className="w-full rounded-md border px-3 py-2"
                            value={questionId}
                            onChange={(e) => setQuestionId(Number(e.target.value))}
                        >
                            {questions.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.text}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="answer">Your answer</Label>

                        {/* Mic recorder inserts transcript into the same answer state */}
                        <MicAnswer onTranscript={(text) => setAnswer(text)} />

                        <Textarea
                            id="answer"
                            placeholder="Type your answer here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={6}
                        />
                    </div>


                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={status === "submitting" || !answer.trim()}>
                            {status === "submitting" ? "Submitting..." : "Submit attempt"}
                        </Button>

                        {/* Tiny helper for testing */}
                        <Input
                            type="text"
                            className="hidden"
                            value={questionId}
                            readOnly
                            aria-hidden
                        />
                    </div>

                    {status !== "idle" && (
                        <div
                            className={
                                status === "success"
                                    ? "mt-4 p-4 rounded-xl border bg-green-50 text-green-800"
                                    : status === "error"
                                        ? "mt-4 p-4 rounded-xl border bg-red-50 text-red-800"
                                        : "mt-4 p-4 rounded-xl border bg-gray-50 text-gray-700"
                            }
                        >
                            <pre className="whitespace-pre-line m-0 text-sm leading-relaxed">
                                {message}
                            </pre>
                        </div>
                    )}

                </form>
            </CardContent>
        </Card>
    );
}
