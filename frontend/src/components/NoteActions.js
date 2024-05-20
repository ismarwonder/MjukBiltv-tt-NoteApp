import React from 'react';
import './NoteActions.css';

const NoteActions = ({ handleSaveNote, selectedNote, deleteNote, openNewNote, isSaveDisabled }) => {
    return (
        <div className="note-actions">
            <button className="new-note-button" onClick={openNewNote}>Nytt</button>
            <button 
                className="save-button" 
                onClick={handleSaveNote} 
                disabled={isSaveDisabled}
            >
                {selectedNote ? 'Uppdatera' : 'Spara'}
            </button>
            {selectedNote && (
                <button 
                    className="delete-button" 
                    onClick={() => deleteNote(selectedNote.id)}
                >
                    Radera
                </button>
            )}
        </div>
    );
};

export default NoteActions;
