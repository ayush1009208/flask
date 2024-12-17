"use client";

import { useState, useEffect, useCallback } from "react";
import { Rocket, PlusCircle, LogOut, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AuthForm1 } from "./components/AuthForm";
import { NotesList } from "./components/NotesList";
import { authService } from "./components/api";
import { Note } from "./components/types";

const NotesApp = () => {
  const [user, setUser] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");

  // Handle login
  const handleLogin = (username: string) => {
    setUser(username);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setNotes([]);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Fetch notes from the API
  const fetchNotes = useCallback(async () => {
    try {
      const response = await authService.fetchNotes();
      if (response.ok) {
        const data = await response.json();
        setNotes(
          data.map((note: any) => ({
            id: note.id,
            content: note.content,
            created_at: note.created_at,
            isPinned: false, // Default state for pinning
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }, []);

  // Add a new note
  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      const response = await authService.addNote(newNoteContent.trim());
      if (response.ok) {
        const newNote = await response.json();
        setNotes([{ ...newNote, isPinned: false }, ...notes]);
        setNewNoteContent(""); // Clear input field
      }
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  // Delete a note
  const deleteNote = async (noteId: number) => {
    try {
      const response = await authService.deleteNote(noteId);
      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      }
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  // Toggle pinning a note
  const togglePinNote = (noteId: number) => {
    setNotes((prevNotes) =>
      prevNotes
        .map((note) =>
          note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
        )
        .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
    );
  };

  // Fetch notes when user logs in
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  // Show login form if user is not authenticated
  if (!user) {
    return <AuthForm1 onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white/10 p-6 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3"
          >
            <Rocket className="text-yellow-300 w-8 h-8" />
            Welcome, {user}!
          </motion.h1>
          <motion.button
            onClick={handleLogout}
            className="bg-white/30 text-white p-2 rounded-full hover:bg-white/40 transition"
            whileHover={{ rotate: 180 }}
          >
            <LogOut className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Add Note Form */}
        <motion.form
          onSubmit={addNote}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 pt-0 flex items-center space-x-3"
        >
          <input
            type="text"
            placeholder="Add a new note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="flex-grow p-3 bg-white/20 backdrop-blur-lg rounded-lg text-white 
            placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 
            transition-all border border-white/10"
          />
          <button
            type="submit"
            disabled={!newNoteContent.trim()}
            className="bg-white/30 text-white p-3 rounded-full hover:bg-white/40 
            transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </motion.form>

        {/* Notes List */}
        <div className="p-6 pt-0 space-y-4 max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white/20 p-4 rounded-lg shadow-lg backdrop-blur-lg 
                hover:bg-white/30 transition-all flex justify-between items-center"
              >
                <div className="flex-grow">
                  <p className="text-white">{note.content}</p>
                  <p className="text-xs text-white/70 mt-1">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => togglePinNote(note.id)}
                    className={`p-1 rounded-full ${
                      note.isPinned
                        ? "bg-yellow-300 text-black"
                        : "bg-white/30 text-white"
                    } hover:bg-yellow-400 transition`}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* No Notes Message */}
          {notes.length === 0 && (
            <div className="text-center text-white/70 py-8">
              <p>No notes yet. Start by adding a new note!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
