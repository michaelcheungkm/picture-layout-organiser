const jimp = require('jimp')

// 16 MP
const MAX_SIZE = 16 * 1000 * 1000
// 80% Quality
const QUALITY = 75

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
    const factor = Math.min(Math.sqrt(MAX_SIZE / size), 1)
    img
      .scale(factor)
      .quality(QUALITY)
      .write(filename + (overwrite ? '' : '-processed') + '.' + fileExt)
    if (cb) {
      cb()
    }
  })
}

module.exports = {
  processImage
}
