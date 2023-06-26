<template>
    <div class="transcription-container" v-if="!isLoading">
        <header>
            <h2>Transcriptions</h2>
            <h3>{{ selectedTranscriptionFileUrl }} <button @click="handleSaveTranscription" v-if="isTranscritionTrackLoaded">save</button></h3>
            <button @click="handleImportTrackFile" v-if="!isTranscritionTrackLoaded">import</button>
            <button @click="handleNewTrackFile" v-if="!isTranscritionTrackLoaded">new</button>
            <button @click="handleClickAdd" v-else>add</button>
        </header>
        <section v-if="loadedTrack && loadedTrack.sortedUtterances">
            <div class="center">
                <Speaker v-for="speaker in loadedTrack.diarizedUtterances" :key="speaker[0].id" :phrases="speaker"></Speaker>
            </div>
        </section>
    </div>
    <div v-else>loading...</div>
</template>
<script setup lang="ts">
import { useMediaStore } from '../stores/media';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import Speaker from './Speaker.vue'
import { useProjectConfig } from '../stores/projectConfig';

const projectConfig = useProjectConfig()
const { configuration } = storeToRefs(projectConfig)

const mediaStore = useMediaStore()
const { selectedTranscriptionFileUrl, loadedTrack } = storeToRefs(mediaStore)

const { isLoadedMetadata } = storeToRefs(mediaStore)

const isLoading = ref(true)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value == true) {
        isLoading.value = false
        const path = configuration.value.transcription?.vtt
        console.log('transcription path', path)
        if(path) {
            selectedTranscriptionFileUrl.value = path
            mediaStore.importTextTrack('transcription', selectedTranscriptionFileUrl.value)
            isTranscritionTrackLoaded.value = true
        } else {
            console.warn('Nenhuma transcrição encontrada')
        }
    }
})

function handleClickAdd() {
    mediaStore.addCue('', mediaStore.getCurrentTime(), mediaStore.getCurrentTime() + 2.5)
}

// @ts-ignore
const electronAPI = window.electronAPI

const isTranscritionTrackLoaded = ref(false)

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

// TODO should copy vtt file to project folder, and update config file vtt path
async function handleImportTrackFile() {
    const paths = await openFileDialog()
    if(paths) {
        selectedTranscriptionFileUrl.value = paths[0]
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
    const data = mediaStore.exportTrack()
    await createTranscriptionFile(mediaStore.selectedTranscriptionFileUrl, data)
}

</script>

<style scoped>
    .center {
       max-width: 1000px;
       margin: 0 auto;
    }
    

    header {
        grid-area: header;
        padding: 10px;
    }

    section {
        /* display: flex; */
        grid-area: center;
        overflow-y: auto;
        padding: 20px 0;
    }
</style>