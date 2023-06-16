<template>
    <div class="transcription-container">
        <h2>Transcrição</h2>
        <h3>{{ transcriptionFileUrl }}</h3>
        <button @click="handleImportTrackFile" v-if="!isTranscritionTrackLoaded">import</button>
        <button @click="handleNewTrackFile" v-if="!isTranscritionTrackLoaded">new</button>
        <button @click="handleClickAdd" v-else>add</button>
        <ul>
            <li v-for="subtitle in subtitles" :key="subtitle.cue.id">
                <TranscriptionItem :subtitle="subtitle" />
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';
import TranscriptionItem from './TranscriptionItem.vue';
import { ref } from 'vue';

const videoStore = useVideoStore()
const { subtitles } = storeToRefs(videoStore)

function handleClickAdd() {
    videoStore.addCue('text', videoStore.getCurrentTime(), videoStore.getCurrentTime() + 10)
}

const electronAPI = window.electronAPI

const isTranscritionTrackLoaded = ref(false)

const transcriptionFileUrl = ref('')

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
        transcriptionFileUrl.value = paths[0]
        console.log('arquivo selecionado', transcriptionFileUrl.value)
        videoStore.importTextTrack('transcription', transcriptionFileUrl.value)
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
    console.log('new file')
    const path = await openSaveDialog()
    if(path) {
        transcriptionFileUrl.value = path
        console.log('caminho selecionado', transcriptionFileUrl.value)
        // videoStore.importTextTrack('transcription', paths[0])
        // isTranscritionTrackLoaded.value = true
    } else {
        console.log('dialogo cancelado')
    }
}


</script>

<style scoped>
    .transcription-container {
        padding: 20px;
    }

    ul {
        list-style: none;
        padding: 0;
        /* background-color: aquamarine; */
        max-height: 77vh;
        overflow-y: auto;
    }
</style>