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

// HTML Routes
app.get('/notes', (req, res) => res.sendFile(`${htmlPath}/notes.html`));
app.get('*', (req, res) => res.sendFile(`${htmlPath}/index.html`));

// Starting server
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
