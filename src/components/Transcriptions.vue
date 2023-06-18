<template>
    <div class="transcription-container" v-if="!isLoading">
        <header>
            <h2>Transcriptions</h2>
            <h3>{{ selectedTranscriptionFileUrl }} <button @click="handleSaveTranscription" v-if="isTranscritionTrackLoaded">save</button></h3>
            <button @click="handleImportTrackFile" v-if="!isTranscritionTrackLoaded">import</button>
            <button @click="handleNewTrackFile" v-if="!isTranscritionTrackLoaded">new</button>
            <button @click="handleClickAdd" v-else>add</button>
        </header>
        <ul>
            <li v-for="subtitle in transcriptions" :key="subtitle.cue.id">
                <TranscriptionItem :transcription="subtitle" />
            </li>
        </ul>
    </div>
    <div v-else>loading...</div>
</template>
<script setup lang="ts">
import { useAudioStore } from '../stores/audio';
import { storeToRefs } from 'pinia';
import TranscriptionItem from './TranscriptionItem.vue';
import { ref, watch } from 'vue';

const audioStore = useAudioStore()
const { selectedTranscriptionFileUrl, transcriptions } = storeToRefs(audioStore)

const { isLoadedMetadata } = storeToRefs(audioStore)

const isLoading = ref(true)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value == true) {
        isLoading.value = false
    }
})

function handleClickAdd() {
    audioStore.addCue('[text]', audioStore.getCurrentTime(), audioStore.getCurrentTime() + 2.5)
}

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

async function handleImportTrackFile() {
    const paths = await openFileDialog()
    if(paths) {
        selectedTranscriptionFileUrl.value = paths[0]
        // console.log('arquivo selecionado', selectedTranscriptionFileUrl.value)
        audioStore.importTextTrack('transcription', selectedTranscriptionFileUrl.value)
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
    // console.log('new file')
    const path = await openSaveDialog()
    if(path) {
        selectedTranscriptionFileUrl.value = path
        // console.log('caminho selecionado', selectedTranscriptionFileUrl.value)
        audioStore.createEmptyTrack('transcription')
        // console.log(videoStore.media.textTracks)
        isTranscritionTrackLoaded.value = true
    } else {
        console.log('dialogo cancelado')
    }
}

async function createFile(path: string, data: any) {
  const response = await electronAPI.createFile(path, data)
}

async function handleSaveTranscription() {
    console.log('save transcription file')
    const data = audioStore.exportTrack('transcription')
    await createFile(audioStore.selectedTranscriptionFileUrl, data)
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

    ul {
        grid-area: center;
        list-style: none;
        padding: 10px;
        margin: 0;
        /* background-color: aquamarine; */
        /* height: 77vh; */
        overflow-y: auto;
    }
</style>