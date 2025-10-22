
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Note } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

type Theme = 'light' | 'dark';

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '# New Note\n\n',
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.length > 1 ? notes.filter(note => note.id !== id)[0].id : null);
    }
  };

  const updateNoteContent = (id: string, content: string) => {
    setNotes(
      notes.map(note => (note.id === id ? { ...note, content } : note))
    );
  };
  
  const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          addNote={addNote}
          deleteNote={deleteNote}
        />
        <main className="flex-1 h-full">
          <Editor
            activeNote={activeNote}
            updateNoteContent={updateNoteContent}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
