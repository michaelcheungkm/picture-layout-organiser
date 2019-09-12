const fs = require('fs');

// N.B synchronous file reading for setup
const workingDirectory
= fs.readFileSync('.config/absoluteDirectory.txt', 'utf8').replace(/\s/g, "");

function getWorkingDirectory() {
  return workingDirectory;
}

function readManagerSync() {
  return JSON.parse(fs.readFileSync(workingDirectory + "/manager.json"));
}

function writeManagerSync(managerJson) {
  fs.writeFileSync(workingDirectory + "/manager.json", JSON.stringify(managerJson) + '\n');
  // TODO: Every x number of tries (or random) garbage clean files that are not referenced any more
}

function saveUserContent(username, userContent) {
  var manager = {...readManagerSync()}
  var userIndex = manager.users.findIndex(u => u.name === username);
  manager.users[userIndex].content = userContent;
  writeManagerSync(manager);
}

function listUsers() {
  var manager = readManagerSync();
  return manager.users.map(u => u.name);
}

function createAccount(name) {
  var manager = readManagerSync();

  if (listUsers().includes(name)) {
    throw "Username already exists";
  }

  var newUser = {
    'name': name,
    'content': []
  };
  manager.users.push(newUser);

  writeManagerSync(manager);
}

function getUserContent(username) {
  var manager = readManagerSync();
  return manager.users.filter(u => u.name === username)[0].content;
}

function addImages(username, files) {
  // TODO: Implement
}


module.exports = {
  getWorkingDirectory,
  listUsers,
  createAccount,
  getUserContent,
  saveUserContent,
  addImages
};
