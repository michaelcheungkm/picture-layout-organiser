const fs = require('fs')
const imageProcessing = require('./imageProcessing.js')

const NUM_HASHES = 50


const directory = './test'
const files = fs.readdirSync(directory)

var count = 0

for (var i = 0; i < files.length; i++) {
  const file = files[i]

  imageProcessing.processImage(directory + '/' + file, err => {
    const outOf = ++count * NUM_HASHES / files.length

    console.log((err ? 'Could not process ' : 'Processed: ') + file + ' '.repeat(NUM_HASHES))
    process.stdout.write('[' + '#'.repeat(Math.ceil(outOf)) + ' '.repeat(Math.floor(NUM_HASHES - outOf)) + '] ' + Math.ceil(outOf / NUM_HASHES * 100) +'%\r')
  }, true)
}
