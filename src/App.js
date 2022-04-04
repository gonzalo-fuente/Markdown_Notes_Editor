import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

function App() {
  /* The use of an arrow function or just a function inside the
  initialization of the state, makes a Lazy State Initalization
  which leads to increase the performance of the app. This is 
  because if we have some code inside our initialization, React
  runs this code each time the function re-renders, leading to
  performance issues. With Lazy State Initialization, React doesn't
  execute this code during re-renders */
  const [notes, setNotes] = useState(() => getNotesFromLocalStorage() || data);
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  );

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("notes"));
  }

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((prevNotes) => {
      // Put the most recently-modified note at the top
      const newArray = [];
      for (let i = 0; i < prevNotes.length; i++) {
        if (prevNotes[i].id === currentNoteId) {
          newArray.unshift({ ...prevNotes[i], body: text });
        } else {
          newArray.push(prevNotes[i]);
        }
      }
      return newArray;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
