const MongoClient = require('mongodb').MongoClient
const ThumbnailGenerator = require('video-thumbnail-generator').default

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

// TODO: manage garbage collection

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

async function getUserContent(username) {
  const collection = db.collection('content')
  userContent = await collection
    .find({user: username})
    .toArray()
  return userContent
}

async function generateThumbnails(files, targetDirectory) {
  // Generate thumbnails for videos
  // Store thumbnail name against filename in map
  var thumbnailMap = new Map()
  // Map each video to promise that thumbnail will be completed and its name put in the map
  var thumbnailPromises = files.filter(f => f.mimetype.startsWith('video'))
    .map(async f => {
      // Generate thumbnail
      const tg = new ThumbnailGenerator({
        sourcePath: targetDirectory + '/' + f.filename,
        thumbnailPath: targetDirectory
      })
      var thumbnail = await tg.generateOneByPercent(50, {size: '640x?'})
      thumbnailMap.set(f.filename, thumbnail)
      return thumbnail
  })

  // Wait for all thumbnails to be complete and added to map
  await Promise.all(thumbnailPromises)
  return thumbnailMap
}

async function addUserMedia(username, files, targetDirectory) {
  const collection = db.collection('content')

  var thumbnailMap = await generateThumbnails(files, targetDirectory)

  var newEntries = files.map(f => {
    if (f.mimetype.startsWith('video')) {
      // Video
      return ({
        'media': f.filename,
        'mediaType': 'video',
        'caption': '',
        'thumbnail': thumbnailMap.get(f.filename),
      })
    } else {
      // Standard image
      return ({
        'media': f.filename,
        'mediaType': 'image',
        'caption': '',
      })
    }
  })

  await collection.insertMany(newEntries)
}

module.exports = {
  listUsers,
  createUser,
  deleteUser,
  getUserContent
}
