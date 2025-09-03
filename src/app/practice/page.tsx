// src/app/practice/page.tsx
import { headers } from "next/headers";
import PracticeForm from "@/components/PracticeForm";

async function getQuestions() {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/questions`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to load questions: ${res.status}`);
    }

    return res.json() as Promise<{ data: Array<{ id: number; text: string }> }>;
}

export default async function PracticePage() {
    const { data: questions } = await getQuestions();

    return (
        <main className="mx-auto max-w-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Practice</h2>

            <PracticeForm questions={questions} />
        </main>
    );
}
