const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');

// The API key we created in step 3
const deepgramApiKey = '8c22a717e82fabf456a38dba55e7304e32abd5d0';

// Replace with your file path and audio mimetype
const pathToFile = './files/datagramfiletest.mp4';
const mimetype = 'audio/mp4';

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

console.log('Requesting transcript...')
console.log('Your file may take up to a couple minutes to process.')
console.log('While you wait, did you know that Deepgram accepts over 40 audio file formats? Even MP4s.')
console.log('To learn more about customizing your transcripts check out developers.deepgram.com.')

deepgram.transcription.preRecorded(
  { buffer: fs.readFileSync(pathToFile), mimetype },
  { punctuate: true, numerals: true, utterances: true, diarize: true, model: 'enhanced', language: 'pt-BR' },
)
.then((transcription) => {
//   fs.writeFileSync('./files/transcription.json', JSON.stringify(transcription, null, 4))
  fs.writeFileSync('./files/captions.vtt', transcription.toWebVTT());
})
.catch((err) => {
  console.log(err);
});