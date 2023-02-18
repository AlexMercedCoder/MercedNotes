export class NoteManager {
  constructor(key = "notes") {
    this.key = key || "notes";
    this.notes = this.#loadNotes();
  }

  #loadNotes() {
    const notesRaw = localStorage.getItem(this.key);
    if (notesRaw) {
      return JSON.parse(notesRaw);
    }
    return [];
  }

  #saveNotes() {
    localStorage.setItem(this.key, JSON.stringify(this.notes));
  }

  addNote(newNote) {
    this.notes.push(newNote);
    this.#saveNotes();
  }

  removeNote(index) {
    this.notes.splice(index, 1);
    this.#saveNotes();
  }

  searchNotes(string) {
    return this.notes.filter((note) => {
      if (note.note.includes(string) || note.tags.includes(string)) {
        return true;
      }
      return false;
    });
  }

  exportNotes(){
    const fileData = JSON.stringify(this.notes);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "notes.json";
    link.href = url;
    link.click();
  }
}

export class NoteRenderer {
  constructor(target, noteMgr) {
    this.target = target;
    this.mgr = noteMgr;
  }

  renderNotes(notes, override) {
    const notesarray = notes || this.mgr.notes;

    if (override) {
      override(notes, this.target);
      return "done";
    }
    const elements = notesarray
      .map(
        (note, index) => `
      <div class="note">
      <div>
      <p class="message">${note.note}</p>
      <p class="tags">${note.tags}</p>
      </div>
      <button class="btn btn-warning" index=${index}>Delete</button>
      </div>
      `
      )
      .join(" ");

    this.target.innerHTML = elements;
    this.wireDeletes();
  }

  wireDeletes() {
    const render = this;
    const deletes = document.querySelectorAll("button[index]");
    for (const button of deletes) {
      button.addEventListener("click", () => {
        const index = parseInt(button.getAttribute("index"));
        this.mgr.removeNote(index);
        render.renderNotes();
      });
    }
  }
}
