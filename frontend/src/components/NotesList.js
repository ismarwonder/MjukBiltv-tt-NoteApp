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
                console.log('Fetched notes:', data);
                setNotes(data);
            })
            .catch(error => console.error('Error fetching notes:', error));
    }, []);

    const deleteNote = (id) => {
        fetch(`http://localhost:8080/notes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setNotes(notes.filter(note => note.id !== id));
        })
        .catch(error => console.error('Error deleting note:', error));
    };

    return (
        <div className="notes-list">
            {notes.map(note => (
                <div key={note.id} className="note-card">
                    <p>{note.content}</p>
                    <button className="delete-button" onClick={() => deleteNote(note.id)}>X</button>
                </div>
            ))}
        </div>
    );
};

export default NotesList;
