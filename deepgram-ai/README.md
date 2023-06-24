# Transcrição de vídeo/áudio para texto
Speech to Text (STT) scripts

Converte arquivos de video/audio locais para transcrições textuais, usando a API do Deepgram.
Pode salvar a transcrição como JSON, WebVTT ou SRT

## Dependencies
- ffmpeg deve estar instalada na máquina ([como instalar no Windows](https://phoenixnap.com/kb/ffmpeg-windows))
- Deve ter uma conta criada e API_KEY gerada em [deepgram.com](https://deepgram.com)

## Installation
`npm install`

## Enviroment Variable
crear .env file na raiz do projeto contendo a sua API_KEY do Deepgram:


`DEEPGRAM_API_KEY=<sua api aqui>`

## Transcrever arquivo local

`npm run transcribe -- --i=path/to/file.mp4 --o=./path/to/transcription.vtt`

**Atenção!**
Caminhos absolutos no Windows devem ser escapados com duas contrabarras

Ex: `C:\\user\\Documents\\filetest.mp4`

**Suported input types (--i)**

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

**Suported output types (--o)**

Os tipos de output suportados são:
- vtt
- srt
- json

**Diarization (--diarization)**

Caso queira gerar um WebVTT file com informações sobre quem está falando.
(Válido apenas para transcrições que geram um arquivo vtt)

`npm run transcribe -- --i=path/to/file.mp4 --o=./path/to/transcription.vtt --diarization`

## Converter arquivos
Utiliza a biblioteca [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) para fazer conversões entre praticamente qualquer tipo de arquivo de mídia.

Pode ser útil para converter um vídeo em áudio antes de mandar para a API de transcrição

`npm run convert -- --i=path/to/file.mp4 --o=./path/to/audio.wav`