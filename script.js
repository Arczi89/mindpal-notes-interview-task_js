document.addEventListener("DOMContentLoaded", () => {
    const app = (function () {
        const notesContainer = document.getElementById("notes-container");
        const addNewNoteBtn = document.getElementById("add-new-note");
        const searchInput = document.getElementById("search-notes");
        const deleteModal = document.getElementById("delete-modal");
        const cancelDeleteBtn = document.getElementById("cancel-delete");
        const confirmDeleteBtn = document.getElementById("confirm-delete");

        let notes = [];
        let noteToDelete = null;

        const renderNotes = () => {
            notesContainer.innerHTML = "";
            notes.forEach((note, index) => {
                const noteCard = createNoteCard(note, index);
                notesContainer.appendChild(noteCard);
            });

            addEventListeners();
        };

        const createNoteCard = (note, index) => {
            const noteCard = document.createElement("div");
            noteCard.className = "note-card";
            noteCard.innerHTML = `
                <h2 class="note-card__title">${note.title}</h2>
                <p class="note-card__content">${note.content}</p>
                <div class="note-card__actions">
                    <button class="note-card__edit-btn" data-index="${index}">Edit</button>
                    <button class="note-card__delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            return noteCard;
        };

        const addEventListeners = () => {
            document.querySelectorAll(".note-card__delete-btn").forEach(button => {
                button.addEventListener("click", handleDeleteNote);
            });

            document.querySelectorAll(".note-card__edit-btn").forEach(button => {
                button.addEventListener("click", handleEditNote);
            });
        };

        const handleAddNewNote = () => {
            const newNote = {
                title: "New Note",
                content: "Enter your note content here..."
            };
            notes.push(newNote);
            renderNotes();
        };

        const handleDeleteNote = (e) => {
            noteToDelete = parseInt(e.target.dataset.index);
            deleteModal.classList.remove("hidden");
        };

        const handleEditNote = (e) => {
            const noteIndex = parseInt(e.target.dataset.index);
            const note = notes[noteIndex];
        };

        const init = () => {
            addNewNoteBtn.addEventListener("click", handleAddNewNote);
            cancelDeleteBtn.addEventListener("click", () => deleteModal.classList.add("hidden"));
            confirmDeleteBtn.addEventListener("click", () => {
                if (noteToDelete !== null) {
                    notes.splice(noteToDelete, 1);
                    renderNotes();
                    deleteModal.classList.add("hidden");
                }
            });

            searchInput.addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase();
                notesContainer.innerHTML = "";
                notes
                    .filter(note => note.title.toLowerCase().includes(searchTerm) || note.content.toLowerCase().includes(searchTerm))
                    .forEach((note, index) => {
                        const noteCard = createNoteCard(note, index);
                        notesContainer.appendChild(noteCard);
                    });
            });

            renderNotes();
        };

        return {
            init
        };
    })();

    app.init();
});
