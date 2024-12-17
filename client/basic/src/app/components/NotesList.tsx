import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star } from 'lucide-react';
import { Note } from './types';

interface NotesListProps {
  notes: Note[];
  onDelete: (noteId: number) => void;
  onTogglePin: (noteId: number) => void;
}

export const NotesList: React.FC<NotesListProps> = ({ notes, onDelete, onTogglePin }) => {
  return (
    <AnimatePresence>
      {notes.map((note: Note) => (
        <motion.div
          key={note.id}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`flex items-center p-4 mb-4 rounded-lg transition 
            ${note.isPinned ? 'bg-yellow-500/30' : 'bg-white/20 backdrop-blur-lg'}`}
        >
          <div className="flex-grow">
            <h4 className="text-lg font-bold">{note.title}</h4>
            <p className="text-sm text-gray-700">{note.content}</p>
          </div>
          <button onClick={() => onTogglePin(note.id)} className="p-2">
            <Star className={note.isPinned ? 'text-yellow-500' : 'text-gray-400'} />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-2">
            <Trash2 className="text-red-500" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
