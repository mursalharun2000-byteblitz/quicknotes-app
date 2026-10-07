const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const clearAllBtn = document.querySelector('#clear-all-btn');

// Load notes from localStorage or start empty
let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

function saveNotes() {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
}

function updateCount(displayedCount) {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (displayedCount === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${displayedCount} notes.`;
    }
}

function render(filterText = "") {
    notesList.innerHTML = ""; 
    
    const searchTerm = filterText.toLowerCase();
    const filteredNotes = notes.filter(note => note.text.toLowerCase().includes(searchTerm));
    
    if (filteredNotes.length === 0 && notes.length > 0) {
        const li = document.createElement('li');
        li.textContent = "No notes match your search.";
        notesList.appendChild(li);
    }

    filteredNotes.forEach(note => {
        const li = document.createElement('li');
        li.className = `note-card category-${note.category}`;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'note-header';
        
        const categorySpan = document.createElement('span');
        categorySpan.className = 'category-badge';
        categorySpan.textContent = note.category;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'note-date';
        dateSpan.textContent = note.createdAt;

        headerDiv.appendChild(categorySpan);
        headerDiv.appendChild(dateSpan);

        const textP = document.createElement('p');
        textP.textContent = note.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));

        li.appendChild(headerDiv);
        li.appendChild(textP);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });

    updateCount(filteredNotes.length);
}

function addNote(e) {
    e.preventDefault();
    const text = noteInput.value;
    
    // Validation
    if (text.trim() === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }
    
    errorMessage.textContent = ""; // Clear error on success

    const newNote = {
        id: Date.now(),
        text: text.trim(),
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();
    noteInput.value = "";
    render(searchInput.value);
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    render(searchInput.value);
}

// Bonus Feature: Clear all
clearAllBtn.addEventListener('click', () => {
    if (notes.length === 0) return;
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render(searchInput.value);
    }
});

// Event Listeners
noteForm.addEventListener('submit', addNote);
searchInput.addEventListener('input', (e) => render(e.target.value));

// Initial page load
render();