
// Elements
const notesContainer = document.getElementById('notes-container');
const noteInput = document.getElementById('note-input');
const addNoteButton = document.getElementById('add-note');
const downloadButton = document.getElementById('download-notes');
const clearButton = document.getElementById('clear-notes');
const notification = document.getElementById('notification');

// Notes array
let notes = [];

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Create a note element
function createNoteElement(text, timestamp) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';

    const noteText = document.createElement('div');
    noteText.textContent = text;

    const noteTimestamp = document.createElement('div');
    noteTimestamp.className = 'timestamp';
    noteTimestamp.textContent = formatTimestamp(timestamp);

    noteElement.appendChild(noteText);
    noteElement.appendChild(noteTimestamp);

    return noteElement;
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Render all notes
function renderNotes() {
    notesContainer.innerHTML = '';

    for (const note of notes) {
        const noteElement = createNoteElement(note.text, note.timestamp);
        notesContainer.appendChild(noteElement);
    }
}

// Add a new note
function addNote() {
    const text = noteInput.value.trim();
    if (text) {
        const newNote = {
            text,
            timestamp: new Date().getTime()
        };

        notes.push(newNote);
        saveNotes();

        const noteElement = createNoteElement(newNote.text, newNote.timestamp);
        notesContainer.prepend(noteElement);

        noteInput.value = '';
        noteInput.focus();
    }
}

// Download notes as text file
function downloadNotes() {
    if (notes.length === 0) {
        showNotification('No notes to download');
        return;
    }

    let content = 'My Notes\n\n';

    for (const note of notes) {
        const timestamp = formatTimestamp(note.timestamp);
        content += `[${timestamp}]\n${note.text}\n\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes_' + new Date().toISOString().slice(0, 10) + '.txt';
    a.click();

    URL.revokeObjectURL(url);
    showNotification('Notes downloaded successfully!');
}

// Clear all notes
function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        notes = [];
        saveNotes();
        notesContainer.innerHTML = '';
        showNotification('All notes cleared');
    }
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Event listeners
addNoteButton.addEventListener('click', addNote);

noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNote();
    }
});

downloadButton.addEventListener('click', downloadNotes);
clearButton.addEventListener('click', clearNotes);

// Prompt user before closing/refreshing the page
window.addEventListener('beforeunload', (e) => {
    if (notes.length > 0) {
        e.preventDefault();
        e.returnValue = '';

        // This will be shown by the browser
        return 'You have unsaved notes. Would you like to download them before leaving?';
    }
});

// Load saved notes on page load
loadNotes();
