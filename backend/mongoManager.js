const MongoClient = require('mongodb').MongoClient

const mongoIP = '127.0.0.1'
const url = 'mongodb://' + mongoIP + ':27017';
const dbName = 'pictureLayoutOrganiser'

const INITIAL_LOCK_POS = -1

var db
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err)
    return
  }
  db = client.db(dbName)
})

async function listUsers(callback) {
  const collection = db.collection('users')
  users = await collection
    .find({})
    .project({ name: 1, _id: 0 })
    .toArray()
  return users.map(u => u.name)
}

async function createUser(newName, callback) {
  const collection = db.collection('users')

  // Check for existing user
  existingUser = await collection
    .find({name: newName})
    .toArray()

  if (existingUser.length > 0) {
    throw new Error('User with that name already exists')
  }

  // Add new user
  await collection.insertOne({
      name: newName,
      lockPos: INITIAL_LOCK_POS
  })

}

async function deleteUser(user) {
  // Remove user from users collection
  const userCollection = db.collection('users')
  await userCollection.deleteOne({ name: user })

  // Remove any content associated with that user
  const contentCollection = db.collection('content')
  await contentCollection.deleteMany({user: user})
}

module.exports = {
  listUsers,
  createUser,
  deleteUser
}
