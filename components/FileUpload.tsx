"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, X, Check, Upload } from "lucide-react";

type Props = {
    onFileSelect: (file: File | null) => void;
};

export default function FileUpload({ onFileSelect }: Props) {
    const [recording, setRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState<number[]>([]);
    const [time, setTime] = useState(0);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number>();
    const streamRef = useRef<MediaStream | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // 🔥 IMPORTANT FIX
    const shouldSaveRef = useRef(true);

    // ⏱ TIMER
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (recording) {
            interval = setInterval(() => setTime((t) => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [recording]);

    const formatTime = () => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    // 📦 FILE HANDLER
    const handleFile = (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            alert("File too large (max 10MB)");
            return;
        }

        setSelectedFile(file); // ✅ ADD THIS
        onFileSelect(file);
    };

    // 🎤 START RECORDING
    const startRecording = async () => {
        setSelectedFile(null);   // clear uploaded file
        setAudioURL(null);       // clear previous recording
        onFileSelect(null);      // reset parent state
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        chunksRef.current = [];
        shouldSaveRef.current = true; // default

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 8;
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256; // frequencyBinCount = 128
        analyser.minDecibels = -85;  // was -100 (default)
        analyser.maxDecibels = -25;  // was -30 (default)

        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const BAR_COUNT = 30;
        let smoothLevels = Array(BAR_COUNT).fill(0);

        const updateWave = () => {
            analyser.getByteFrequencyData(dataArray); // ← switch to frequency data

            smoothLevels = smoothLevels.map((prev, i) => {
                const index = Math.floor((i / BAR_COUNT) * dataArray.length);
                const next = dataArray[index]; // 0–255
                return prev * 0.6 + next * 0.4; // smooth transition
            });

            setAudioLevel([...smoothLevels]);
            animationRef.current = requestAnimationFrame(updateWave);
        };

        updateWave();

        mediaRecorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            cancelAnimationFrame(animationRef.current!);

            // ❌ HARD BLOCK
            if (!shouldSaveRef.current || chunksRef.current.length === 0) {
                chunksRef.current = []; // cleanup
                return;
            }

            const blob = new Blob(chunksRef.current, {
                type: "audio/webm",
            });

            const url = URL.createObjectURL(blob);
            setAudioURL(url);

            const file = new File([blob], "recording.webm", {
                type: "audio/webm",
            });

            onFileSelect(file);
        };

        mediaRecorder.start();
        setRecording(true);
        setTime(0);
    };

    // 🛑 STOP
    const stopRecording = (save = true) => {
        shouldSaveRef.current = save; // 🔥 KEY FIX

        mediaRecorderRef.current?.stop();

        // 🛑 stop mic (removes chrome red dot)
        streamRef.current?.getTracks().forEach((track) => track.stop());

        setRecording(false);

        if (!save) {
            chunksRef.current = [];
            setAudioURL(null);
            onFileSelect(null);
        }
    };

    return (
        <div className="space-y-6">

            {/* 📦 DRAG & DROP */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                }}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${dragActive
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 hover:border-white/20"
                    }`}
            >
                <Upload className="mx-auto mb-2 text-gray-400" size={20} />
                <p className="text-sm text-gray-300">
                    Drag & drop audio OR click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Supports all audio formats (MP3, WAV, M4A, AAC) • max 10MB
                </p>
            </div>
            {selectedFile && !recording && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 flex items-center justify-between">
                    <span className="truncate">{selectedFile.name}</span>

                    <button
                        onClick={() => {
                            setSelectedFile(null);
                            onFileSelect(null);
                        }}
                        className="text-red-400 text-xs"
                    >
                        Remove
                    </button>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                    e.target.value = "";
                }}
            />

            {/* 🎤 RECORD BUTTON */}
            {!recording && (
                <div
                    onClick={startRecording}
                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 cursor-pointer hover:bg-white/10 transition"
                >
                    <Mic size={18} className="text-purple-400" />
                    <span className="text-sm text-gray-300">
                        Start Recording
                    </span>
                </div>
            )}

            {/* 🎧 AUDIO PREVIEW */}
            {audioURL && !recording && (
                <audio controls src={audioURL} className="w-full mt-2" />
            )}

            {/* 💬 CHATGPT BAR */}
            {recording && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">

                    {/* ❌ CANCEL */}
                    <button
                        onClick={() => {
                            shouldSaveRef.current = false;
                            chunksRef.current = []; // 🔥 clear before stop
                            stopRecording(false);
                        }}
                        className="p-2 rounded-full hover:bg-white/10 transition"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>

                    {/* 🎧 WAVE + TEXT */}
                    <div className="flex items-center gap-3 flex-1 justify-center">
                        <div className="flex items-end gap-[2px] h-6">
                            {audioLevel.map((level, i) => (
                                <div
                                    key={i}
                                    className="w-[2px] bg-purple-400 rounded"
                                    style={{
                                        height: `${Math.max(Math.sqrt(level / 255) * 22, 2)}px`

                                    }}
                                />
                            ))}
                        </div>

                        <span className="text-sm text-gray-300">
                            Listening • {formatTime()}
                        </span>
                    </div>

                    {/* ✔ DONE */}
                    <button
                        onClick={() => stopRecording(true)}
                        className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition"
                    >
                        <Check size={16} className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
}