const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
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
    .sort({orderIndex: 1})
    .toArray()
  return userContent
}

async function updateContentOrder(username, idOrder, lockIndex) {
  // Update orderIndex to match input
  const contentCollection = db.collection('content')
  for (var i = 0; i < idOrder.length; i++) {
    var id = idOrder[i]
    await contentCollection.updateOne(
      {'_id': new mongo.ObjectID(id)},
      {orderIndex: i}
    )
  }

  // Update lockIndex
  const userCollection = db.collection('users')
  await userCollection.updateOne(
    {name: username},
    {lockPos: lockIndex}
  )
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

  var newEntries = files.map((f, index) => {
    if (f.mimetype.startsWith('video')) {
      // Video
      return ({
        'user': username,
        'media': f.filename,
        'mediaType': 'video',
        'orderIndex': index,
        'caption': '',
        'thumbnail': thumbnailMap.get(f.filename)
      })
    } else {
      // Standard image
      return ({
        'user': username,
        'media': f.filename,
        'mediaType': 'image',
        'orderIndex': index,
        'caption': ''
      })
    }
  })

  // Increase the orderIndex of all existing content for user
  await db.collection('inventory').updateMany(
    { user: username },
    { $inc: { orderIndex: files.length}}
  )

  await collection.insertMany(newEntries)
}

async function addUserGallery(username, files, targetDirectory) {
  const collection = db.collection('content')

  var thumbnailMap = await generateThumbnails(files)

  var galleryContent = files.map(f => {
    if (f.mimetype.startsWith('video')) {
      // Video
      return ({
        'user': username,
        'media': f.filename,
        'mediaType': 'video',
        'thumbnail': thumbnailMap.get(f.filename)
      })
    } else {
      // Standard image
      return ({
        'user': username,
        'media': f.filename,
        'mediaType': 'image'
      })
    }
  })

  var galleryEntry = {
    'media': galleryContent,
    'mediaType': 'gallery',
    'caption': ''
  }

  // Increase the orderIndex of all existing content for user
  await db.collection('inventory').updateMany(
    { user: username },
    { $inc: { orderIndex: 1}}
  )

  await collection.insertOne(galleryEntry)
}

module.exports = {
  listUsers,
  createUser,
  deleteUser,
  getUserContent,
  updateContentOrder,
  addUserMedia,
  addUserGallery
}
