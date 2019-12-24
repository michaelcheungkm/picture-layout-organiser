const MongoClient = require('mongodb').MongoClient

const mongoIP = '127.0.0.1'
const url = 'mongodb://' + mongoIP + ':27017';
const dbName = 'pictureLayoutOrganiser'

var db

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err)
    return
  }
  db = client.db(dbName)
})

function listUsers(callback) {
  const collection = db.collection('users')
  collection
    .find({})
    .project({ name: 1, _id: 0 })
    .toArray(function(err, users) {
      if (err) {
        console.log(err)
        return
      }
      callback(users.map(u => u.name))
    })
}

module.exports = {
  listUsers
}
