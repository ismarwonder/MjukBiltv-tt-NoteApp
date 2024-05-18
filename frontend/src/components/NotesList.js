import React, { useEffect, useState } from 'react';
import './NotesList.css';

const NotesList = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/notes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setNotes(data);
            })
            .catch(error => console.error('Error fetching notes:', error));
    }, []);

    return (
        <div className="notes-list">
            {notes.map(note => (
                <div key={note.id} className="note-card">
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    );
};

export default NotesList;
