import { NoteManager, NoteRenderer } from "./notes.js";

const mgr = new NoteManager();
const render = new NoteRenderer(document.querySelector("main"), mgr);
const form = document.querySelector("form");
const search = document.querySelector("input[name='search'");
const exportButton = document.querySelector("#export");

// initial render
render.renderNotes();

// add note
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(this);

  const newNote = {
    note: formData.get("note"),
    tags: formData.get("tags"),
  };

  mgr.addNote(newNote);
  render.renderNotes();
});

search.addEventListener("input", (event) => {
  render.renderNotes(mgr.searchNotes(event.target.value));
});

exportButton.addEventListener("click", (event) => {
  mgr.exportNotes();
});
