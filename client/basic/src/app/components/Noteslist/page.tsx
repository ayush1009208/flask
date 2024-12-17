"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, Lock, Unlock } from 'lucide-react';
import { Note } from '../types';

interface NotesListProps {
  notes: Note[];
  onDelete: (noteId: number) => void;
  onTogglePin: (noteId: number) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onDelete, onTogglePin }) => {
  return (
    <AnimatePresence>
      {notes.map((note) => (
        <motion.div 
          key={note.id}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`flex items-center p-4 mb-4 rounded-lg transition ${
            note.isPinned ? 'bg-yellow-500/30' : 'bg-white/20 backdrop-blur-lg'
          }`}
        >
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <p className="text-sm">{note.content}</p>
          </div>

          <div className="flex space-x-2">
            <button onClick={() => onTogglePin(note.id)} className="text-yellow-400">
              {note.isPinned ? <Unlock /> : <Lock />}
            </button>
            <button onClick={() => onDelete(note.id)} className="text-red-500">
              <Trash2 />
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default NotesList;
