document.addEventListener('DOMContentLoaded', () => {
  let noteForm;
  let noteTitle;
  let noteText;
  let saveNoteBtn;
  let newNoteBtn;
  let clearBtn;
  let noteList;

  let notes = JSON.parse(localStorage.getItem('notes')) || [];

  if (window.location.pathname === '/miniature-eureka/index.html') {
    noteForm = document.querySelector('.note-form');
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    clearBtn = document.querySelector('.clear-btn');
    noteList = document.querySelector('#notes-list');
  }

  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  let activeNote = {};

  const getNotes = () =>
    fetch('/miniature-eureka/index.html', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

  const saveToLocalStorage = () => {
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  const getNotesFromLocalStorage = () => {
    notes = JSON.parse(localStorage.getItem('notes')) || [];
  };

  const saveNote = (note) => {
    notes.push(note);
    saveToLocalStorage();
    return Promise.resolve();
  };

  const deleteNote = (id) => {
    notes = notes.filter(note => note.id !== id);
    saveToLocalStorage();
    return Promise.resolve();
  };

  const renderActiveNote = () => {
    hide(saveNoteBtn);
    hide(clearBtn);

    if (activeNote.id) {
      show(newNoteBtn);
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      hide(newNoteBtn);
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };

  const handleNoteSave = () => {
    const newNote = {
      id: Date.now(),
      title: noteTitle.value,
      text: noteText.value
    };
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
    console.log("Saved note");
  };

  const handleNoteDelete = (e) => {
    e.stopPropagation();
    const noteId = JSON.parse(e.target.parentElement.getAttribute('data-note')).id;
    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
  };

  const handleNewNoteView = (e) => {
    e.preventDefault();
    activeNote = {};
    show(clearBtn);
    renderActiveNote();
  };

  const handleRenderBtns = () => {
    show(clearBtn);
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(clearBtn);
    } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  const renderNoteList = () => {
    noteList.innerHTML = '';
    let noteListItems = [];
  
    const createLi = (text, delBtn = true) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item');
  
      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = text;
      spanEl.addEventListener('click', handleNoteView);
  
      liEl.append(spanEl);
  
      if (delBtn) {
        const delBtnEl = document.createElement('i');
        delBtnEl.classList.add(
          'fas',
          'fa-trash-alt',
          'float-right',
          'text-danger',
          'delete-note'
        );
        delBtnEl.addEventListener('click', handleNoteDelete);
  
        liEl.append(delBtnEl);
      }
  
      return liEl;
    };
  
    if (notes.length === 0) {
      noteListItems.push(createLi('No saved Notes', false));
    }
  
    notes.forEach((note) => {
      const li = createLi(note.title);
      li.dataset.note = JSON.stringify(note);
  
      noteListItems.push(li);
    });
  
    noteListItems.forEach((note) => noteList.appendChild(note)); // Corrected line
  };
  

  const getAndRenderNotes = () => getNotes().then(renderNoteList);

  if (window.location.pathname === '/miniature-eureka/.html') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);
  }

  getAndRenderNotes();
});
