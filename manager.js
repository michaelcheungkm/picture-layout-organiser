const fs = require('fs');

// N.B synchronous file reading for setup
const workingDirectory
= fs.readFileSync('.config/absoluteDirectory.txt', 'utf8').replace(/\s/g, "");

function readManagerSync() {
  return JSON.parse(fs.readFileSync(workingDirectory + "/manager.json"));
}

function writeManagerSync(managerJson) {
  fs.writeFileSync(workingDirectory + "/manager.json", JSON.stringify(managerJson) + '\n');
}

function listUsers() {
  var manager = readManagerSync();
  return manager.users.map(u => u.name);
}

function createUser(name) {
  var manager = readManagerSync();

  if (listUsers().includes(name)) {
    throw "Username already exists";
  }

  var newUser = {
    'name': name
  };
  manager.users.push(newUser);

  writeManagerSync(manager);
}

module.exports = {
  listUsers,
  createUser
};
