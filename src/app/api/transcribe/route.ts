import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // ensure Node runtime for file handling

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file" }, { status: 400 });
        }

        // Read file into a Buffer so we can send it to the SDK
        const arrayBuf = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // Choose model:
        // - If you have access: "gpt-4o-mini-transcribe"
        // - Otherwise: "whisper-1"
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const useModel =
            process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe";

        // OpenAI Node SDK accepts a Blob-like or Readable, but here we pass a Uint8Array with a filename
        const resp = await client.audio.transcriptions.create({
            file: new File([buffer], file.name || "audio.webm", { type: file.type || "audio/webm" }),
            model: useModel,
            // language: "en", // optional hint
            // response_format: "json", // default OK
        });

        const text = resp.text ?? "";
        return NextResponse.json({ text });
    } catch (err: any) {
        console.error("POST /api/transcribe error:", err?.message || err);
        return NextResponse.json(
            { error: "Transcription failed", details: err?.message },
            { status: 500 }
        );
    }
}

export async function HEAD() { return new Response(null, { status: 200 }); }
