import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/notes')
            .then(response => setNotes(response.data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Notes App</h1>
            {notes.map(note => (
                <div key={note.id}>{note.content}</div>
            ))}
        </div>
    );
}

export default App;
