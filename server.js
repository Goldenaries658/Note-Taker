const express = require("express");
const path = require("path");

// Setting up express
const app = express();
const PORT = process.env.PORT || 8080;

// Parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Defining path
const htmlPath = path.join(__dirname, "./public");

// HTML Route
app.get("/notes", (req, res) => res.sendFile(`${htmlPath}/notes.html`));

app.use(require("./routes/api"));
// Starting server
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
