require('dotenv').config()
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');
const mime = require('mime');
const utils = require('./utils')

console.time()
try {

  const commands = process.argv.slice(2).map(arg => arg.split('=')).map(command => ({ key: command[0].replace('--', ''), value: command[1] }))
  
  const inputPath = commands.find(c => c.key == 'i').value
  const outputPath = commands.find(c => c.key == 'o').value
  const inputMimeType = mime.getType(inputPath)
  
  if(!inputMimeType) {
    console.error('Error processing input file')
    return
  }

 console.log('Converting...')
 utils.convert(inputPath, outputPath, function(err){
  if(!err) {
      console.log('Conversion file created:', outputPath)
  }
  console.timeEnd()
})

} catch(error) {
  console.error(error)
}
