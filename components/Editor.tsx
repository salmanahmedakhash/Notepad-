
import React, { useState, useEffect } from 'react';
import type { Note } from '../types';
import { summarizeText } from '../services/geminiService';

interface EditorProps {
  activeNote: Note | undefined;
  updateNoteContent: (id: string, content: string) => void;
}

const AIBrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
        <path d="M12 13V9" />
        <path d="M17.8 11.2a2.5 2.5 0 0 1 0 4.6" />
        <path d="M6.2 11.2a2.5 2.5 0 0 0 0 4.6" />
        <path d="M14 22a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 14 17v0a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 14 22Z" />
        <path d="M10 22a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 10 17v0a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 10 22Z" />
        <path d="M4 12a8 8 0 0 0 16 0" />
    </svg>
);

const SummaryModal: React.FC<{ summary: string; onClose: () => void }> = ({ summary, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 m-4 max-w-2xl w-full transform transition-all duration-300 scale-95 hover:scale-100" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Summary</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">&times;</button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto p-1">
                    {summary.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const Editor: React.FC<EditorProps> = ({ activeNote, updateNoteContent }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    // If note changes, close the summary modal
    setSummary(null);
  }, [activeNote?.id]);

  const handleSummarize = async () => {
    if (!activeNote || activeNote.content.trim().length < 50) {
        alert("Please write a note with at least 50 characters to summarize.");
        return;
    }
    setIsSummarizing(true);
    setSummary(null);
    try {
        const result = await summarizeText(activeNote.content);
        setSummary(result);
    } catch (error) {
        setSummary("An error occurred while summarizing.");
    } finally {
        setIsSummarizing(false);
    }
  };


  if (!activeNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <span className="text-5xl mb-4">🗒️</span>
        <h2 className="text-2xl font-semibold">Select a note</h2>
        <p>Or create a new one to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="flex items-center justify-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed shadow-sm"
        >
          <AIBrainIcon />
          {isSummarizing ? "Summarizing..." : "Summarize with AI"}
        </button>
      </div>
      <textarea
        key={activeNote.id}
        value={activeNote.content}
        onChange={(e) => updateNoteContent(activeNote.id, e.target.value)}
        className="flex-1 w-full p-6 text-base bg-transparent resize-none focus:outline-none leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-400"
        placeholder="Start writing your note here..."
        autoFocus
      />
      {summary && <SummaryModal summary={summary} onClose={() => setSummary(null)} />}
    </div>
  );
};

export default Editor;
