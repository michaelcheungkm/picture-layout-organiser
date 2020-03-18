const jimp = require('jimp')

// 16 MP
const MAX_SIZE = 16 * 1000 * 1000
// 80% Quality
const QUALITY = 75

const EPSILON = 0.01

function processImage(input, cb, overwrite = true) {
  jimp.read(input, (err, img) => {
    if (err) {
      cb(err)
      return
    }
    const split = input.match(/(.*)\.(.*)/)
    const filename = split[1]
    const fileExt = split[2]

    const size = img.bitmap.width * img.bitmap.height

    if (size < EPSILON * MAX_SIZE) {
      return
    }

    const factor = Math.sqrt(MAX_SIZE / size)
    img
      .scale(factor)
      .quality(QUALITY)
      .write(filename + (overwrite ? '' : '-processed') + '.' + fileExt)
    if (cb) {
      cb()
    }
  })
}

async function processImageSync(input, overwrite = true) {
  await jimp.read(input)
    .then(img => {
      const split = input.match(/(.*)\.(.*)/)
      const filename = split[1]
      const fileExt = split[2]

      const size = img.bitmap.width * img.bitmap.height

      if (size < EPSILON * MAX_SIZE) {
        return
      }

      const factor = Math.sqrt(MAX_SIZE / size)
      return img
        .scale(factor)
        .quality(QUALITY)
        .write(filename + (overwrite ? '' : '-processed') + '.' + fileExt)
    })
    .catch(err => console.error(err))
}

module.exports = {
  processImage,
  processImageSync
}
