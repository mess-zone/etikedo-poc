require('dotenv').config()
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');
const mime = require('mime');

try {
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY
  
  const commands = process.argv.slice(2).map(arg => arg.split('=')).map(command => ({ key: command[0].replace('--', ''), value: command[1] }))
  
  const inputPath = commands.find(c => c.key == 'i').value
  const outputPath = commands.find(c => c.key == 'o').value
  const inputMimeType = mime.getType(inputPath)
  const outputMimeType = mime.getType(outputPath)
  
  if(!inputMimeType) {
    console.error('Error processing input file')
    return
  }
  
  const deepgram = new Deepgram(deepgramApiKey);
  
  console.log('Requesting transcript...')
  console.log('Your file may take up to a couple minutes to process.')
  console.log('While you wait, did you know that Deepgram accepts over 40 audio file formats? Even MP4s.')
  console.log('To learn more about customizing your transcripts check out developers.deepgram.com.')
  
  deepgram.transcription.preRecorded(
    { buffer: fs.readFileSync(inputPath), mimetype: inputMimeType },
    { punctuate: true, numerals: true, utterances: true, diarize: true, model: 'enhanced', language: 'pt-BR' },
  )
  .then((response) => {
    if(outputMimeType == 'text/vtt') {
      return response.toWebVTT()
    } else if(outputMimeType == 'application/x-subrip') {
      return response.toSRT()
    }
    return JSON.stringify(response, null, 4)
  })
  .then((transcription) => {
      fs.writeFileSync(outputPath, transcription);
      console.log('Transcription file created:', outputPath)
  })
  .catch((err) => {
    console.log(err);
  });

} catch(error) {
  console.error(error)
}