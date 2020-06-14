const express = require('express');
const fs = require('fs');
const path = require('path');

// Setting up express
const app = express();
const PORT = process.env.PORT || 8080;

// Parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Defining paths
const htmlPath = path.join(__dirname, './public');
const apiPath = path.join(__dirname, './db');
const notesDB = path.join(apiPath + '/db.json');

// API Routes
// Returning notes from db
app.get('/api/notes', async (req, res, next) => {
  try {
    // Reading notes and saving to variable as a string
    const notes = JSON.parse(await readNotes());
    // Returning the notes
    return res.status(200).json(notes);
  } catch (err) {
    console.log(`Error: server.js - app.get('api/notes'): ${err}`);
    next(err);
    return res.status(404).send('Error 404: No Notes Found.');
  }
});

// Posting notes to db
app.post('/api/notes', async (req, res, next) => {
  try {
    const newNote = req.query;
    // Reading existing notes
    const notes = JSON.parse(await readNotes());
    // Adding a unique ID and pushing new note to existing array
    newNote['id'] = notes.length;
    notes.push(newNote);

    // Saving the new notes array to db
    writeNote(notes);

    // Returning new note to client
    res.status(200).send(newNote);
  } catch (err) {
    console.log(`Error: server.js - app.post('api/notes'): ${err}`);
    next(err);
  }
});

app.delete('/api/notes/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

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

    res.status(200);
  } catch (err) {
    console.log(`Error: server.js - app.delete('api/notes'): ${err}`);
    next(err);
  }
});

// HTML Routes
app.get('/notes', (req, res) => res.sendFile(`${htmlPath}/notes.html`));
app.get('*', (req, res) => res.sendFile(`${htmlPath}/index.html`));

// Starting server
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// Function to read existing notes
const readNotes = async () => {
  return fs.readFileSync(notesDB, (err, data) => {
    if (err) throw err;
    return data;
  });
};

const writeNote = (notes) => {
  console.log('Writing new Notes array to db...');
  fs.writeFileSync(notesDB, JSON.stringify(notes, null, 2));
  console.log('Save Complete!');
};
