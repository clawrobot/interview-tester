"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
    onTranscript: (text: string) => void; // hand text back to parent
};

export default function MicAnswer({ onTranscript }: Props) {
    const [recording, setRecording] = useState(false);
    const [status, setStatus] = useState<"idle" | "recording" | "uploading" | "error" | "done">("idle");
    const [message, setMessage] = useState("");
    const mediaRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    async function start() {
        setMessage("");
        chunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = async () => {
            try {
                setStatus("uploading");
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const form = new FormData();
                form.append("file", blob, "answer.webm");

                const res = await fetch("/api/transcribe", { method: "POST", body: form });
                if (!res.ok) throw new Error(`Transcribe failed: ${res.status}`);
                const data = await res.json(); // { text: "..." }
                onTranscript(data.text || "");
                setStatus("done");
                setMessage("Transcribed! You can edit before submitting.");
            } catch (e: any) {
                console.error(e);
                setStatus("error");
                setMessage(e?.message ?? "Transcription failed.");
            }
        };
        mr.start();
        mediaRef.current = mr;
        setRecording(true);
        setStatus("recording");
    }

    function stop() {
        mediaRef.current?.stop();
        mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
        mediaRef.current = null;
        setRecording(false);
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Button type="button" onClick={start} disabled={recording || status === "uploading"}>
                    🎙️ Start recording
                </Button>
                <Button type="button" variant="secondary" onClick={stop} disabled={!recording}>
                    ⏹️ Stop
                </Button>
            </div>
            {status !== "idle" && (
                <p className={
                    status === "error" ? "text-sm text-red-600" :
                        status === "recording" ? "text-sm text-amber-600" :
                            status === "uploading" ? "text-sm text-muted-foreground" :
                                "text-sm text-green-700"
                }>
                    {status === "recording" && "Recording… speak naturally, then press Stop."}
                    {status === "uploading" && "Uploading and transcribing…"}
                    {message}
                </p>
            )}
        </div>
    );
}
