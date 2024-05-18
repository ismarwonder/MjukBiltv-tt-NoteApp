import React, { useState, useEffect, useRef } from 'react';
import './NoteViewer.css';
import NoteActions from './NoteActions';

const NoteViewer = ({ selectedNote, deleteNote, createNote, updateNote, openNewNote }) => {
    const [content, setContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const contentRef = useRef(null);

    useEffect(() => {
        if (selectedNote) {
            setContent(selectedNote.content);
            setOriginalContent(selectedNote.content);
        } else {
            setContent('');
            setOriginalContent('');
        }
    }, [selectedNote]);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.textContent = content;
        }
    }, [content]);

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

    const isSaveDisabled = selectedNote ? content === originalContent : content.trim() === '';

    return (
        <div className="note-viewer">
            <NoteActions 
                createNote={handleSaveNote} 
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
