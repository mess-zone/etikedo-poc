require('dotenv').config()
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');
const mime = require('mime');

console.time()
try {
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY
  
  const commands = process.argv.slice(2).map(arg => arg.split('=')).map(command => ({ key: command[0].replace('--', ''), value: command[1] }))
  
  const inputPath = commands.find(c => c.key == 'i').value
  const outputPath = commands.find(c => c.key == 'o').value
  const diarization = !!commands.find(c => c.key == 'diarization')
  const inputMimeType = mime.getType(inputPath)
  const outputMimeType = mime.getType(outputPath)
  
  if(!inputMimeType) {
    console.error('Error processing input file')
    return
  }

  if(diarization && outputMimeType !== 'text/vtt') {
    console.error('Diarization is only supported for generating vtt output file extension')
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
    if(diarization) {
      return response.results.utterances
    }

    if(outputMimeType == 'text/vtt') {
      return response.toWebVTT()
    } else if(outputMimeType == 'application/x-subrip') {
      return response.toSRT()
    }
    return JSON.stringify(response, null, 4)
  })
  .then((transcription) => {
      if(diarization) {
        return asWebVTT(createMetadata(transcription))
      }
      return transcription
  })
  .then((transcription) => {
      fs.writeFileSync(outputPath, transcription);
      console.log('Transcription file created:', outputPath)
      console.timeEnd()
  })
  .catch((err) => {
    console.log(err);
  });

} catch(error) {
  console.error(error)
}

const escapeNewLines = (str) => {
  return str.replace(/\n/g, "\\n")
}

function asWebVTT(data) {
  let content = 'WEBVTT'

  content += data.map((cue) => 
      `\n\n${cue.id}` +
      `\n${formatDuration(cue.start)} --> ${formatDuration(cue.end)}` +
      `\n${JSON.stringify(cue.metadata)}` 
  ).join('')

  return content
}

function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  const milliseconds = Math.floor((durationInSeconds % 1) * 1000);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMilliseconds = milliseconds.toString().padStart(3, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function createMetadata(utterances) {
  return utterances.map((u => ({
    id: u.id, 
    start: u.start, 
    end: u.end, 
    metadata: {
        speaker: u.speaker,
        layout: 'INLINE',
        text: escapeNewLines(u.transcript),
    },
})))
}