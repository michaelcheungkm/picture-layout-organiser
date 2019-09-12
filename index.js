const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const manager = require('./manager.js');

const app = express();
const API_PORT = process.env.PORT_BASE;

// Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// API calls
app.get('/listUsers', (req, res) => {
  console.log("Call to listUsers");
  res.send(manager.listUsers());
});

app.post('/createAccount', (req, res) => {
  console.log("Call to createAccount");
  const { name } = req.body;
  try {
    manager.createAccount(name);
  } catch(err) {
    res.status(422).send('Username already exists\n');
    return;
  }
  res.send('Added \"' + name + '\"\n');
});

app.get('/:username/getUserContent', (req, res) => {
  console.log("Call to getUserContent");
  const username = req.params.username;
  res.send(manager.getUserContent(username))
});

app.get('/:username/loadAllAndGetUserContent', (req, res) => {
  console.log("Call to loadAll");
  const username = req.params.username;
  res.send(manager.loadAllAndGetUserContent(username));
});

// TODO: more RESTful solution?
app.post('/:username/saveUserContent', (req, res) => {
  console.log("Call to saveUserContent");
  const { content } = req.body;
  const username = req.params.username;
  manager.saveUserContent(username, content);
  res.send("Saved user content");
});

// Multer to handle disk storage for uploads
var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      // Set storage directory to working directory
      cb(null, manager.getWorkingDirectory())
    },
    filename: function (req, file, cb) {
      // Rename files by prepending date to avoid name clashes
      cb(null, Date.now() + '-' +file.originalname )
    }
});
var upload = multer({ storage: storage }).array('file');

app.post('/:username/addUserImages', (req, res) => {
  console.log("Call to addUserImages");
  const { formData } = req.body;
  const username = req.params.username;

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    // TODO: better response message
    return res.send("Uploaded images")
    }
  );
});


app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`));
