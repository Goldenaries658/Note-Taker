const express = require('express');
const fs = require('fs');
const path = require('path');

// Setting up express
const app = express();
const PORT = process.env.PORT || 8080;

// Parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    console.log(`Error: server.js - ln23 - readNotes(): ${err}`);
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

    // Saving the new note to db
    console.log('Writing Note...');
    fs.writeFileSync(notesDB, JSON.stringify(notes));
    console.log('Save Complete!');

    // Returning new note to client
    res.status(200).send(newNote);
  } catch (err) {
    console.log(`Error: server.js - ln42 - readNotes(): ${err}`);
    next(err);
  }
});

// HTML Routes
app.get('/notes', (req, res) => res.sendFile(`${htmlPath}/notes.html`));
app.get('*', (req, res) => res.sendFile(`${htmlPath}/index.html`));

// Function to read existing notes
const readNotes = async () => {
  return fs.readFileSync(notesDB, (err, data) => {
    if (err) throw err;
    return data;
  });
};

// Starting server
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
