import React from 'react';
import './NotesList.css';

const NotesList = ({ notes, setSelectedNote, selectedNote }) => {
    return (
        <div className="notes-list-container">
            <div className="notes-list">
                {notes.map(note => (
                    <div 
                        key={note.id} 
                        className={`note-card ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                        onClick={() => setSelectedNote(note)}
                    >
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesList;
