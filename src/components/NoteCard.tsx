"use client";

import { Star, Edit2, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string, starred: boolean) => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onToggleStar,
}: NoteCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-gray-200/50 p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 dark:border-gray-700/50 dark:hover:shadow-gray-900/50"
      style={{ backgroundColor: note.color }}
    >
      {/* Star Button */}
      <button
        onClick={() => onToggleStar(note.id, !note.starred)}
        className={`absolute right-3 top-3 rounded-full p-1.5 transition-all ${
          note.starred
            ? "text-yellow-500 bg-yellow-100"
            : "text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-black/5"
        }`}
      >
        <Star
          className={`h-5 w-5 ${note.starred ? "fill-yellow-500" : ""}`}
        />
      </button>

      {/* Content */}
      <h3 className="mb-2 pr-8 text-lg font-semibold text-gray-800 line-clamp-2">
        {note.title}
      </h3>
      <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-4 whitespace-pre-wrap">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-black/5 pt-3">
        <span className="text-xs text-gray-500">{formatDate(note.updatedAt)}</span>
        
        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(note)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-black/5 hover:text-violet-600"
            title="Edit note"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
