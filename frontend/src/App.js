import React, { useEffect, useState } from 'react';
import NotesList from './components/NotesList';
import NoteViewer from './components/NoteViewer';
import './App.css';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

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
                if (data.length > 0) {
                    setSelectedNote(data[0]); 
                }
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
            const updatedNotes = notes.filter(note => note.id !== id);
            setNotes(updatedNotes);
            if (updatedNotes.length > 0) {
                setSelectedNote(updatedNotes[0]); 
            } else {
                setSelectedNote(null); 
            }
        })
        .catch(error => console.error('Error deleting note:', error));
    };

    const createNote = (content) => {
        if (content.trim() === '') return;

        fetch('http://localhost:8080/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const updatedNotes = [...notes, data];
            setNotes(updatedNotes);
            setSelectedNote(data); 
        })
        .catch(error => console.error('Error creating note:', error));
    };

    const updateNote = (id, content) => {
        fetch(`http://localhost:8080/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const updatedNotes = notes.map(note => 
                note.id === id ? { ...note, content: data.content } : note
            );
            setNotes(updatedNotes);
            setSelectedNote(data); 
        })
        .catch(error => console.error('Error updating note:', error));
    };

    const openNewNote = () => {
        setSelectedNote(null);
    };

    return (
        <div className="app-container">
            <NotesList 
                notes={notes} 
                setSelectedNote={setSelectedNote}
                selectedNote={selectedNote}
            />
            <NoteViewer 
                selectedNote={selectedNote} 
                deleteNote={deleteNote} 
                createNote={createNote}
                updateNote={updateNote}
                openNewNote={openNewNote}
            />
        </div>
    );
};

export default App;
