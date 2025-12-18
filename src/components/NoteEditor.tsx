"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, X, Sparkles } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface Note {
  id?: string;
  title: string;
  content: string;
  color: string;
}

interface NoteEditorProps {
  note?: Note | null;
  onSave: (note: Omit<Note, "id">) => void;
  onClose: () => void;
}

const NOTE_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#fee2e2" },
  { name: "Orange", value: "#ffedd5" },
  { name: "Yellow", value: "#fef9c3" },
  { name: "Green", value: "#dcfce7" },
  { name: "Blue", value: "#dbeafe" },
  { name: "Purple", value: "#f3e8ff" },
  { name: "Pink", value: "#fce7f3" },
];

export default function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "#ffffff");
  const [activeField, setActiveField] = useState<"title" | "content">("title");

  const {
    transcript,
    listening,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition();

  // Append voice transcript to active field
  useEffect(() => {
    if (!transcript) return;

    if (activeField === "title") {
      setTitle((prev) => prev + transcript);
    } else {
      setContent((prev) => prev + transcript);
    }

    setTranscript(""); // clear after use
  }, [transcript, activeField, setTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim(),
        color,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: color }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {note ? "Edit Note" : "Create Note"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-black/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setActiveField("title")}
              className="w-full bg-transparent text-lg font-medium text-gray-800 placeholder-gray-500 outline-none"
            />

            {/* Content */}
            <textarea
              placeholder="Start typing or use voice..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setActiveField("content")}
              rows={6}
              className="w-full resize-none bg-transparent text-gray-700 placeholder-gray-500 outline-none"
            />

            {/* Voice Input */}
            <div className="flex items-center gap-3 rounded-xl bg-black/5 p-3">
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                  listening
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse"
                    : "bg-violet-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
                }`}
              >
                {listening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {listening ? "Listening..." : "Voice Input"}
                </p>
                <p className="text-xs text-gray-500">
                  {listening
                    ? `Recording to ${activeField}...`
                    : `Click to add voice to ${activeField}`}
                </p>
              </div>

              {listening && (
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-1 animate-pulse rounded-full bg-red-500"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "0.6s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Color:</span>
              <div className="flex gap-2">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === c.value
                        ? "border-violet-500 ring-2 ring-violet-500/20"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-black/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                {note ? "Update Note" : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
