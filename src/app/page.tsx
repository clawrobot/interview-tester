// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-3">Interview Tester</h1>
      <p className="text-muted-foreground mb-6">
        You’ll pick a question, paste or type an answer, and we’ll score it with AI.
      </p>

      <div className="space-x-3">
        <Link
          href="/practice"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
