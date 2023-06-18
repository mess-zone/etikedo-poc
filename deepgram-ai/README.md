# Transcrição de vídeo/audio para texto
Speech to Text (STT) scripts


Converte um video para audio
Utiliza a API do Deepgram para converter video/audio para texto
Pode retornar a transcrição como JSON, WebVTT ou SRT

## Dependencies
- ffmpeg deve estar instalada na máquina ([como instalar no Windows](https://phoenixnap.com/kb/ffmpeg-windows))
- Deve ter uma conta criada e API_KEY gerada em [deepgram.com](https://deepgram.com)

## Installation
`npm install`

## Enviroment Variable
crear .env file na raiz do projeto contendo a API_KEY do Deepgram


`DEEPGRAM_API_KEY=<sua api aqi>`

## Execution

**Transcrever arquivo local** 

`npm run transcribe -- --i=path/to/file.mp4 --o=./path/to/transcription.vtt`

## Suported input types (--i)
Segundo a [documentação do Deepgram](https://developers.deepgram.com/docs/supported-audio-formats), os tipos de arquivos suportados são:
- MP3
- MP4
- MP2
- AAC
- WAV
- FLAC
- PCM
- M4A
- Ogg
- Opus
- WebM
- And more...

## Suported output types (--o)
Os tipos de output suportados são:
- vtt
- srt
- json