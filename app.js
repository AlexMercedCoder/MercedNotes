import { NoteManager, NoteRenderer } from "./notes.js";

const mgr = new NoteManager();
const render = new NoteRenderer(document.querySelector("main"), mgr);
const form = document.querySelector("form");
const search = document.querySelector("input[name='search']");
const exportButton = document.querySelector("#export");
const fileInput = document.querySelector("input[type='file']");
const importButton = document.querySelector("#import");

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

  this.reset()
});

search.addEventListener("input", (event) => {
  render.renderNotes(mgr.searchNotes(event.target.value));
});

exportButton.addEventListener("click", (event) => {
  mgr.exportNotes();
});

importButton.addEventListener("click", (event) => {
  if (!fileInput.files[0].name.includes(".json")) {
    alert("Not a JSON file");
    return 0;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  try {
    reader.readAsText(file);
    reader.onload = (event) => {
      const notes = JSON.parse(event.target.result);

      if (notes instanceof Array === false) {
        alert("loaded json format should be [{note: '', tags: ''},{...}]");
        return 0;
      }

      if (!notes.every((note) => note.note && note.tags)) {
        alert("loaded json format should be [{note: '', tags: ''},{...}]");
        return 0;
      }

      mgr.notes = notes;
      render.renderNotes();
    };
  } catch (error) {
    alert("Error reading file, not a text file, or improper schema");
  }
});
