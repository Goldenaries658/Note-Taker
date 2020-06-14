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
app.get('/api/notes', async (req, res) => {
  try {
    // Reading notes and saving to variable as a string
    const notes = fs.readFileSync(notesDB, (err, data) => {
      if (err) throw new Error(`server.js ln20 - fs.readFile(): ${err}`);
      return data;
    });

    // Parsing and returning the notes
    const notesJSON = JSON.parse(notes);
    return res.status(200).json(notesJSON);
  } catch (err) {
    console.log(err);
    return res.status(404).send('Error 404: No Notes Found.');
  }
});

// HTML Routes
app.get('/notes', (req, res) => res.sendFile(`${htmlPath}/notes.html`));
app.get('*', (req, res) => res.sendFile(`${htmlPath}/index.html`));

// Starting server
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
