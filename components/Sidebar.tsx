
import React from 'react';
import type { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string) => void;
  addNote: () => void;
  deleteNote: (id: string) => void;
}

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const NoteItem: React.FC<{ note: Note; isActive: boolean; onClick: () => void; onDelete: (e: React.MouseEvent) => void; }> = ({ note, isActive, onClick, onDelete }) => {
    const title = note.content.split('\n')[0].replace(/#/g, '').trim() || 'Untitled Note';
    const preview = note.content.substring(title.length).trim().slice(0, 40) + '...';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 group ${isActive ? 'bg-primary-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold truncate pr-2">{title}</h3>
                <button
                    onClick={onDelete}
                    className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 ${isActive ? 'text-white hover:bg-primary-400 focus:ring-white' : 'text-gray-500 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-red-100 focus:ring-red-500'}`}
                    aria-label="Delete note"
                >
                    <DeleteIcon />
                </button>
            </div>
            <p className={`text-sm truncate ${isActive ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>{preview}</p>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ notes, activeNoteId, setActiveNoteId, addNote, deleteNote }) => {
  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={addNote}
          className="w-full bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-sm"
        >
          + New Note
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {notes.length > 0 ? (
          notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => setActiveNoteId(note.id)}
              onDelete={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
            />
          ))
        ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                <p>No notes yet.</p>
                <p>Create one to get started!</p>
            </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
