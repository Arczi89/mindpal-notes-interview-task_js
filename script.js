document.addEventListener("DOMContentLoaded", () => {
    const app = (function () {
        const notesContainer = document.getElementById("notes-container");
        const addNewNoteBtn = document.getElementById("add-new-note");
        const searchInput = document.getElementById("search-notes");
        const deleteDialog = document.getElementById("delete-dialog");
        const confirmDeleteBtn = document.getElementById("confirm-delete");
        const cancelDeleteBtn = document.getElementById("cancel-delete");
        const noteFormContainer = document.getElementById("note-form-container");
        const noteTitleInput = document.getElementById("note-title");
        const noteContentInput = document.getElementById("note-content");
        const saveNoteBtn = document.getElementById("save-note");
        const cancelNoteBtn = document.getElementById("cancel-note");
        const addNewNoteEmptyState = document.getElementById("add-note-empty-state");
        const overlay = document.getElementById("overlay");

        let notes = [
            {
                title: "Note title",
                content: "Note body",
                date: "May 22",
            },
            {
                title: "Note title 2",
                content: "Very long Note Body to give you an example on how the box should act",
                date: "May 22",
            },
        ];

        let noteToDeleteIndex = null;
        let noteToEditIndex = null;

        const renderNotes = () => {
            notesContainer.innerHTML = "";
        
            if (notes.length === 0) {
                showEmptyState();
            } else {
                hideEmptyState();
                notes.forEach((note, index) => {
                    const noteCard = createNoteCard(note, index);
                    notesContainer.appendChild(noteCard);
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
            document.getElementById("empty-state").classList.remove("hidden");
            addNewNoteBtn.classList.add("hidden");
        };
        
        const hideEmptyState = () => {
            document.getElementById("empty-state").classList.add("hidden");
            addNewNoteBtn.classList.remove("hidden");
        };

        const addEventListeners = () => {
            document.querySelectorAll(".note-card__delete-btn").forEach(element => {
                element.addEventListener("click", handleDeleteNoteClick);
            });

            document.querySelectorAll(".note-card__edit-btn").forEach(element => {
                element.addEventListener("click", handleEditNoteClick);
            });
        };

        const handleDeleteNoteClick = (e) => {
            noteToDeleteIndex = parseInt(e.target.closest("a").dataset.index);
            deleteDialog.classList.remove("hidden");
            overlay.classList.remove("hidden");
        };

        const handleDeleteNote = () => {
            if (noteToDeleteIndex !== null) {
                notes.splice(noteToDeleteIndex, 1);
                noteToDeleteIndex = null;
                deleteDialog.classList.add("hidden");
                overlay.classList.add("hidden");
                renderNotes();
            }
        };

        const handleCancelDelete = () => {
            noteToDeleteIndex = null;
            deleteDialog.classList.add("hidden");
            overlay.classList.add("hidden");
        };

        const handleAddNewNote = () => {
            hideEmptyState();
            notesContainer.insertBefore(noteFormContainer, notesContainer.firstChild);
            noteFormContainer.classList.remove("hidden");
            addNewNoteBtn.classList.add("hidden");
            noteToEditIndex = null;
            saveNoteBtn.textContent = "Add";
            document.querySelector(".note-form__card-title div").textContent = "Add new note";
        };
     
        const handleEditNoteClick = (e) => {
            noteToEditIndex = parseInt(e.target.closest("a").dataset.index);
            const note = notes[noteToEditIndex];

            noteTitleInput.value = note.title;
            noteContentInput.value = note.content;

            const noteCard = e.target.closest(".note-card");
            noteCard.parentNode.insertBefore(noteFormContainer, noteCard.nextSibling);

            noteFormContainer.classList.remove("hidden");
            saveNoteBtn.scrollIntoView({ behavior: "smooth", block: "start" });
            saveNoteBtn.textContent = "Save";
            document.querySelector(".note-form__card-title div").textContent = "Modify note";

            noteCard.style.display = "none";

            document.querySelectorAll(".note-card__edit-btn").forEach((btn, index) => {
                if (index !== noteToEditIndex) {
                    btn.classList.add("disabled");
                }
            });
        };

        const handleSaveNewNote = () => {
            const title = noteTitleInput.value.trim();
            const content = noteContentInput.value.trim();

            if (title && content) {
                const newNote = {
                    title: title,
                    content: content,
                    date: new Date().toLocaleDateString(),
                };

                if (noteToEditIndex !== null) {
                    notes[noteToEditIndex] = newNote;
                    noteToEditIndex = null;
                } else {
                    notes.unshift(newNote);
                }

                noteTitleInput.value = "";
                noteContentInput.value = "";
                noteFormContainer.classList.add("hidden");
                addNewNoteBtn.classList.remove("hidden");

                document.querySelectorAll(".note-card__edit-btn").forEach(btn => btn.classList.remove("disabled"));

                renderNotes();
            }
        };

        const handleCancelNewNote = () => {
            noteTitleInput.value = "";
            noteContentInput.value = "";
            noteFormContainer.classList.add("hidden");
            addNewNoteBtn.classList.remove("hidden");

            if (noteToEditIndex !== null) {
                const noteCard = document.querySelectorAll(".note-card")[noteToEditIndex];
                noteCard.style.display = "flex";
                noteToEditIndex = null;
            }

            document.querySelectorAll(".note-card__edit-btn").forEach(btn => btn.classList.remove("disabled"));

            if (notes.length === 0) {
                showEmptyState();
            }
        };

        const handleSearchNotes = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const noteCards = document.querySelectorAll(".note-card");
            
            noteCards.forEach(noteCard => {
                const title = noteCard.querySelector(".note-card__title").textContent.toLowerCase();
                
                if (title.includes(searchTerm)) {
                    noteCard.style.display = "flex";
                } else {
                    noteCard.style.display = "none";
                }
            });
        
            const visibleNotes = Array.from(noteCards).some(noteCard => noteCard.style.display !== "none");
        
            if (!visibleNotes) {
                showEmptyState();
            } else {
                hideEmptyState();
            }
        };
        

        const init = () => {
            addNewNoteBtn.addEventListener("click", handleAddNewNote);
            addNewNoteEmptyState.addEventListener("click", handleAddNewNote);
            saveNoteBtn.addEventListener("click", handleSaveNewNote);
            cancelNoteBtn.addEventListener("click", handleCancelNewNote);
            searchInput.addEventListener("input", handleSearchNotes);
            confirmDeleteBtn.addEventListener("click", handleDeleteNote);
            cancelDeleteBtn.addEventListener("click", handleCancelDelete);
            renderNotes();
        };

        return {
            init
        };
    })();

    app.init();
});
