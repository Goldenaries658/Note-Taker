const router = require("express").Router();
const fs = require("fs");

const notesDB = "./db/db.json";

const readNotes = () => fs.readFileSync(notesDB);

const writeNote = (notes) => {
  console.log("Writing new Notes array to db...");
  fs.writeFileSync(notesDB, JSON.stringify(notes, null, 2));
  console.log("Save Complete!");
};

// API Routes
// Returning notes from db
router.get("/api/notes", async (req, res, next) => {
  try {
    // Reading notes and saving to variable as a string
    const notes = JSON.parse(await readNotes());
    // Returning the notes
    return res.status(200).json(notes);
  } catch (err) {
    console.log(`Error: api.js - router.get('api/notes'): ${err}`);
    next(err);
    return res.status(404).send("Error 404: No Notes Found.");
  }
});

// Posting notes to db
router.post("/api/notes", async ({ body }, res, next) => {
  const newNote = body;
  // Reading existing notes
  try {
    const notes = JSON.parse(await readNotes());
    // Adding a unique ID and pushing new note to existing array
    newNote["id"] = notes.length + 1;
    notes.push(newNote);

    // Saving the new notes array to db
    writeNote(notes);

    // Returning new note to client
    res.status(200).send(newNote);
  } catch (err) {
    console.log(`Error: api.js - router.post('api/notes'): ${err}`);
    next(err);
  }
});

router.delete("/api/notes/:id", async ({ params }, res, next) => {
  const id = { params };

  try {
    // Reading existing notes
    const notes = JSON.parse(await readNotes());

    let removedNote = {};
    // Looping through notes array
    for (i in notes) {
      // Checking id and removing the matching note
      if (notes[i].id == id) {
        removedNote = notes.splice(i, 1);

        // Shifting ids down to fill gap
        for (j = i; j < notes.length; j++) {
          notes[j].id--;
        }
        break;
      }
    }

    // Saving the new notes array to db
    writeNote(notes);

    res.status(200).end();
  } catch (err) {
    console.log(`Error: api.js - router.delete('api/notes'): ${err}`);
    next(err);
  }
});

module.exports = router;
