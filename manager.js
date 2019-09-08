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

function writeUserSync(username, userContent) {
  var manager = {...readManagerSync()}
  var userIndex = manager.users.findIndex(u => u.name === username);
  manager.users[userIndex].content = userContent;
  writeManagerSync(manager);
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

function loadAllAndGetUserContent(username) {
  var files = fs.readdirSync(workingDirectory);

  var userContent = [...getUserContent(username)];
  var userContentNames = [...userContent.map(c => c.img)];

  files.filter(f => f !== "manager.json")
    .filter(f => !userContentNames.includes(f))
    .filter(f => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".png"))
    .map(
      f => ({
        'img': f,
        'caption': ''
      })
    )
    .forEach(o => userContent.push(o));

  writeUserSync(username, userContent);

  return getUserContent(username);
}

module.exports = {
  listUsers,
  createUser,
  getUserContent,
  loadAllAndGetUserContent
};
