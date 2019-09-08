const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const apiPort = 3001;

// N.B synchronous file reading for setup
const workingDirectory = fs.readFileSync('.config/absoluteDirectory.txt', 'utf8');

function readManagerSync() {
  return fs.readFileSync(workingDirectory + "/manager.json")
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
