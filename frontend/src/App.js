import React from 'react';
import NotesList from './components/NotesList';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Note Taking App</h1>
            </header>
            <main>
                <NotesList />
            </main>
        </div>
    );
}

export default App;
