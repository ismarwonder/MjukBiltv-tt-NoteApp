import React, { useState, useEffect, useRef } from 'react';
import './NoteViewer.css';
import NoteActions from './NoteActions';

const NoteViewer = ({ selectedNote, deleteNote, createNote, updateNote, openNewNote }) => {
    const [content, setContent] = useState('');
    const contentRef = useRef(null);

    useEffect(() => {
        if (selectedNote) {
            setContent(selectedNote.content);
            if (contentRef.current) {
                contentRef.current.textContent = selectedNote.content;
            }
        } else {
            setContent('');
            if (contentRef.current) {
                contentRef.current.textContent = '';
            }
        }
    }, [selectedNote]);

    const handleSaveNote = () => {
        if (selectedNote) {
            updateNote(selectedNote.id, content);
        } else {
            createNote(content);
        }
    };

    const handleInput = (e) => {
        setContent(e.currentTarget.textContent);
    };

    const isSaveDisabled = selectedNote ? content.trim() === '' || content === selectedNote.content : content.trim() === '';

    return (
        <div className="note-viewer">
            <NoteActions 
                handleSaveNote={handleSaveNote} 
                selectedNote={selectedNote} 
                deleteNote={deleteNote}
                openNewNote={openNewNote}
                isSaveDisabled={isSaveDisabled}
            />
            <div
                className="note-viewer-content"
                contentEditable
                ref={contentRef}
                onInput={handleInput}
                placeholder="Skriv din not här..."
            >
            </div>
        </div>
    );
};

export default NoteViewer;
