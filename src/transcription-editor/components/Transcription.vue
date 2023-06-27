<template>
    <div class="transcription-container" v-if="!isLoading">
        <header>
            <h2>Transcription</h2>
            <h3>{{ selectedTranscriptionFileUrl }} <button @click="handleSaveTranscription" v-if="isTranscritionTrackLoaded">save</button></h3>
            <button @click="handleImportTrackFile" v-if="!isTranscritionTrackLoaded">import</button>
            <button @click="handleNewTrackFile" v-if="!isTranscritionTrackLoaded">new</button>
            <button @click="handleClickAdd" v-else>add</button>
        </header>
        <section v-if="loadedTrack && loadedTrack.sortedUtterances">
            <Speaker v-for="speaker in loadedTrack.diarizedUtterances" :key="speaker[0].id" :phrases="speaker"></Speaker>
        </section>
    </div>
    <div v-else>loading...</div>
</template>
<script setup lang="ts">
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import Speaker from '@/transcription-editor/components/Speaker.vue'
import { useProjectConfig } from '@/stores/projectConfig';

const projectConfig = useProjectConfig()
const { configuration } = storeToRefs(projectConfig)

const mediaStore = useMediaStore()
const { selectedTranscriptionFileUrl, loadedTrack } = storeToRefs(mediaStore)

const { isLoadedMetadata } = storeToRefs(mediaStore)

const isLoading = ref(true)

watch(isLoadedMetadata, async () => {
    if(isLoadedMetadata.value == true) {

        const pathJson = configuration.value.transcription?.json
        if(pathJson) {
            console.log('configuração da transcrição', pathJson)
            const transcriptionConfig = await openTranscriptionConfigFile(pathJson)
            // console.log(transcriptionConfig)
            mediaStore.createEmptyTrack()
            for(const word of transcriptionConfig.words) {
                mediaStore.importCue(word.id, word.text, word.start, word.end, word.speaker)
            }
            isTranscritionTrackLoaded.value = true
        } else {
            console.warn('Nenhuma transcrição encontrada')
        }
        isLoading.value = false
    }
})

function handleClickAdd() {
    mediaStore.addCue('', mediaStore.getCurrentTime(), mediaStore.getCurrentTime() + 2.5)
}

// @ts-ignore
const electronAPI = window.electronAPI

const isTranscritionTrackLoaded = ref(false)

async function openTranscriptionConfigFile(fullPath: string) {
    console.log('OPEN TRANSLATION CONFIG FILE', fullPath)
    const content = await electronAPI.readFile(fullPath)
    return JSON.parse(content)
}

async function openFileDialog() {
    const dialogConfig = {
        title: 'Select a transcription file',
        buttonLabel: 'Importar',
        properties: ['openFile'],
        filters: [
            { name: 'VTT', extensions: ['vtt'] },
        ]
    };

     
    const result = await electronAPI.openFileDialog(dialogConfig)
    return result

}

// TODO should transform vtt file into transcription config json
async function handleImportTrackFile() {
    const paths = await openFileDialog()
    if(paths) {
        selectedTranscriptionFileUrl.value = paths[0]
        // console.log('arquivo selecionado', selectedTranscriptionFileUrl.value)
        mediaStore.importTextTrack('transcription', selectedTranscriptionFileUrl.value)
        isTranscritionTrackLoaded.value = true
    } else {
        console.log('dialogo cancelado')
    }
}

async function openSaveDialog() {
    const dialogConfig = {
        title: 'Select a directory to save transcription',
        buttonLabel: 'Salvar como',
        defaultPath: 'transcription.vtt',
        filters: [
            { name: 'VTT', extensions: ['vtt'] },
        ]
    };

     
    const result = await electronAPI.openSaveDialog(dialogConfig)
    return result

}

// TODO should create a new transcription config json
async function handleNewTrackFile() {
    const path = await openSaveDialog()
    if(path) {
        selectedTranscriptionFileUrl.value = path
        mediaStore.createEmptyTrack()
        isTranscritionTrackLoaded.value = true
    } else {
        console.log('dialogo cancelado')
    }
}

async function createTranscriptionFile(path: string, data: any) {
  const response = await electronAPI.createFile(path, data)
}

async function handleSaveTranscription() {
    console.log('save transcription file')
    const data = mediaStore.exportTrackToJson()
    const fileContent = {
        words: data,
    }
    await createTranscriptionFile(configuration.value.transcription.json, JSON.stringify(fileContent))
}

</script>

<style scoped>
    .transcription-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        grid-template-areas: 
            "header"
            "center";
        justify-items: stretch;
    }

    header {
        grid-area: header;
        padding: 10px;
    }

    section {
        /* display: flex; */
        grid-area: center;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px 0;
    }
</style>