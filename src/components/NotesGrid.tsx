"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, Search, Mic, Star, StickyNote } from "lucide-react";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";

interface Note {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesGrid() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "starred">("all");

  const fetchNotes = useCallback(async () => {
    if (!session) return;
    
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Filter notes based on search and star filter
  useEffect(() => {
    let filtered = notes;

    if (filter === "starred") {
      filtered = filtered.filter((note) => note.starred);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    setFilteredNotes(filtered);
  }, [notes, filter, searchQuery]);

  const handleSave = async (noteData: { title: string; content: string; color: string }) => {
    try {
      if (editingNote) {
        // Update existing note
        const response = await fetch(`/api/notes/${editingNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });

        if (response.ok) {
          const updatedNote = await response.json();
          setNotes((prev) =>
            prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
          );
        }
      } else {
        // Create new note
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });

        if (response.ok) {
          const newNote = await response.json();
          setNotes((prev) => [newNote, ...prev]);
        }
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    }

    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleToggleStar = async (id: string, starred: boolean) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes((prev) =>
          prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
        );
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const openEditor = (note?: Note) => {
    setEditingNote(note || null);
    setIsEditorOpen(true);
  };

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20">
          <Mic className="h-10 w-10 text-violet-600" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to NoteLm
        </h2>
        <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
          Your voice-powered note taking app. Sign in with Google to start
          creating notes using your voice or keyboard.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
            <Mic className="h-4 w-4" />
            Voice Input
          </div>
          <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
            <Star className="h-4 w-4" />
            Star Notes
          </div>
          <div className="flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
            <StickyNote className="h-4 w-4" />
            Organize
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Notes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {notes.length} {notes.length === 1 ? "note" : "notes"} total
          </p>
        </div>

        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
        >
          <Plus className="h-5 w-5" />
          New Note
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 shadow-sm transition-shadow focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setFilter("starred")}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              filter === "starred"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Star className="h-4 w-4" />
            Starred
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <StickyNote className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {searchQuery || filter === "starred"
              ? "No notes found"
              : "No notes yet"}
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try a different search term"
              : filter === "starred"
              ? "Star some notes to see them here"
              : "Create your first note to get started"}
          </p>
          {!searchQuery && filter === "all" && (
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 rounded-lg bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/30"
            >
              <Plus className="h-4 w-4" />
              Create Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={openEditor}
              onDelete={handleDelete}
              onToggleStar={handleToggleStar}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
}
