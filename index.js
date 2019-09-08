const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const manager = require('./manager.js');

const app = express();
const apiPort = 3001;

// Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// API calls
app.get('/listUsers', (req, res) => {
  console.log("Call to listUsers");
  res.send(manager.listUsers());
});

app.post('/createUser', (req, res) => {
  console.log("Call to createUser");
  const { name } = req.body;
  try {
    manager.createUser(name);
  } catch(err) {
    res.status(422).send('Username already exists\n');
    return;
  }
  res.send('Added \"' + name + '\"\n');
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
