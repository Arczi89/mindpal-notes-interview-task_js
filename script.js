document.addEventListener("DOMContentLoaded", () => {
    const app = (() => {
        const elements = {
            notesContainer: document.getElementById("notes-container"),
            addNewNoteBtn: document.getElementById("add-new-note"),
            searchInput: document.getElementById("search-notes"),
            deleteDialog: document.getElementById("delete-dialog"),
            confirmDeleteBtn: document.getElementById("confirm-delete"),
            cancelDeleteBtn: document.getElementById("cancel-delete"),
            noteFormContainer: document.getElementById("note-form-container"),
            noteTitleInput: document.getElementById("note-title"),
            noteContentInput: document.getElementById("note-content"),
            saveNoteBtn: document.getElementById("save-note"),
            cancelNoteBtn: document.getElementById("cancel-note"),
            addNewNoteEmptyState: document.getElementById("add-note-empty-state"),
            overlay: document.getElementById("overlay"),
            emptyState: document.getElementById("empty-state")
        };

        let notes = [
            { title: "Note title", content: "Note body", date: "May 22" },
            { title: "Note title 2", content: "Very long Note Body to give you an example on how the box should act", date: "May 22" }
        ];

        let noteToDeleteIndex = null;
        let noteToEditIndex = null;

        // render section
        const renderNotes = () => {
            elements.notesContainer.innerHTML = "";
            if (notes.length === 0) {
                showEmptyState();
            } else {
                hideEmptyState();
                notes.forEach((note, index) => {
                    const noteCard = createNoteCard(note, index);
                    elements.notesContainer.appendChild(noteCard);
                });
            }
            addEventListeners();
        };

        const createNoteCard = (note, index) => {
            const noteCard = document.createElement("div");
            noteCard.className = "note-card";
            noteCard.innerHTML = `
                <div class="note-card__header">
                    <h2 class="note-card__title">${note.title}</h2>
                    <div class="note-card__actions">
                        <a class="note-card__edit-btn icon" data-index="${index}">
                            <img src="./assets/icons/edit.png"/>
                        </a>
                        <a class="note-card__delete-btn icon" data-index="${index}">
                            <img src="./assets/icons/trash.png"/>
                        </a>
                    </div>
                </div>
                <p class="note-card__content">${note.content}</p>
                <p class="note-card__date">${note.date}</p>
            `;
            return noteCard;
        };

        const showEmptyState = () => {
            elements.emptyState.classList.remove("hidden");
            elements.addNewNoteBtn.classList.add("hidden");
        };

        const hideEmptyState = () => {
            elements.emptyState.classList.add("hidden");
            elements.addNewNoteBtn.classList.remove("hidden");
        };

        // notes section
        const handleDeleteNoteClick = e => {
            noteToDeleteIndex = parseInt(e.target.closest("a").dataset.index);
            elements.deleteDialog.classList.remove("hidden");
            elements.overlay.classList.remove("hidden");
        };

        const handleDeleteNote = () => {
            if (noteToDeleteIndex !== null) {
                notes.splice(noteToDeleteIndex, 1);
                noteToDeleteIndex = null;
                elements.deleteDialog.classList.add("hidden");
                elements.overlay.classList.add("hidden");
                elements.searchInput.classList.remove("hidden");
                renderNotes();
            }
        };

        const handleCancelDelete = () => {
            noteToDeleteIndex = null;
            elements.deleteDialog.classList.add("hidden");
            elements.overlay.classList.add("hidden");
        };

        const handleAddNewNote = () => {
            elements.searchInput.disabled = true;
            hideEmptyState();
            elements.notesContainer.insertBefore(elements.noteFormContainer, elements.notesContainer.firstChild);
            elements.noteFormContainer.classList.remove("hidden");
            elements.addNewNoteBtn.classList.add("hidden");
            document.querySelectorAll(".note-card__edit-btn").forEach((btn) => btn.classList.add('hidden'));
            noteToEditIndex = null;
            elements.saveNoteBtn.textContent = "Add";
            document.querySelector(".note-form__card-title div").textContent = "Add new note";
        };

        const handleEditNoteClick = e => {
            elements.searchInput.disabled = true;
            elements.addNewNoteBtn.disabled = true;
            noteToEditIndex = parseInt(e.target.closest("a").dataset.index);
            const note = notes[noteToEditIndex];

            elements.noteTitleInput.value = note.title;
            elements.noteContentInput.value = note.content;

            const noteCard = e.target.closest(".note-card");
            noteCard.parentNode.insertBefore(elements.noteFormContainer, noteCard.nextSibling);

            elements.noteFormContainer.classList.remove("hidden");
            elements.saveNoteBtn.scrollIntoView({ behavior: "smooth", block: "start" });
            elements.saveNoteBtn.textContent = "Save";
            document.querySelector(".note-form__card-title div").textContent = "Modify note";

            noteCard.style.display = "none";
            document.querySelectorAll(".note-card__edit-btn").forEach((btn, index) => {
                if (index !== noteToEditIndex) {
                    btn.classList.add('hidden');
                }
            });
        };

        const handleSaveNewNote = () => {
            const title = elements.noteTitleInput.value.trim();
            const content = elements.noteContentInput.value.trim();

            if (title && content) {
                const newNote = {
                    title,
                    content,
                    date: new Date().toLocaleDateString()
                };

                if (noteToEditIndex !== null) {
                    notes[noteToEditIndex] = newNote;
                    noteToEditIndex = null;
                } else {
                    notes.unshift(newNote);
                }

                elements.noteTitleInput.value = "";
                elements.noteContentInput.value = "";
                elements.noteFormContainer.classList.add("hidden");
                elements.addNewNoteBtn.classList.remove("hidden");
                document.querySelectorAll(".note-card__edit-btn").forEach(btn => btn.classList.remove('hidden'));
                elements.searchInput.disabled = false;
                elements.addNewNoteBtn.disabled = false;
                renderNotes();
            }
        };

        const handleCancelNewNote = () => {
            elements.searchInput.disabled = false;
            elements.addNewNoteBtn.disabled = false;
            elements.noteTitleInput.value = "";
            elements.noteContentInput.value = "";
            elements.noteFormContainer.classList.add("hidden");
            elements.addNewNoteBtn.classList.remove("hidden");

            if (noteToEditIndex !== null) {
                const noteCard = document.querySelectorAll(".note-card")[noteToEditIndex];
                noteCard.style.display = "flex";
                noteToEditIndex = null;
            }

            document.querySelectorAll(".note-card__edit-btn").forEach(btn => btn.classList.remove('hidden'));

            if (notes.length === 0) {
                showEmptyState();
            }
        };

        // search section
        const handleSearchNotes = e => {
            const searchTerm = e.target.value.toLowerCase();
            const noteCards = document.querySelectorAll(".note-card");

            noteCards.forEach(noteCard => {
                const title = noteCard.querySelector(".note-card__title").textContent.toLowerCase();
                noteCard.style.display = title.includes(searchTerm) ? "flex" : "none";
            });

            const visibleNotes = Array.from(noteCards).some(noteCard => noteCard.style.display !== "none");
            !visibleNotes ? showEmptyState() : hideEmptyState();
        };

        // init section
        const addEventListeners = () => {
            document.querySelectorAll(".note-card__delete-btn").forEach(element => 
                element.addEventListener("click", handleDeleteNoteClick)
            );
            document.querySelectorAll(".note-card__edit-btn").forEach(element => 
                element.addEventListener("click", handleEditNoteClick)
            );
        };

        const init = () => {
            elements.addNewNoteBtn.addEventListener("click", handleAddNewNote);
            elements.addNewNoteEmptyState.addEventListener("click", handleAddNewNote);
            elements.saveNoteBtn.addEventListener("click", handleSaveNewNote);
            elements.cancelNoteBtn.addEventListener("click", handleCancelNewNote);
            elements.searchInput.addEventListener("input", handleSearchNotes);
            elements.confirmDeleteBtn.addEventListener("click", handleDeleteNote);
            elements.cancelDeleteBtn.addEventListener("click", handleCancelDelete);
            renderNotes();
        };

        return { init };
    })();

    app.init();
});
