<template>
    <div class="transcription-container" v-if="!isLoading">
        <h2>Transcrição</h2>
        <h3>{{ selectedTranscriptionFileUrl }} <button @click="handleSaveTranscription" v-if="isTranscritionTrackLoaded">save</button></h3>
        <button @click="handleImportTrackFile" v-if="!isTranscritionTrackLoaded">import</button>
        <button @click="handleNewTrackFile" v-if="!isTranscritionTrackLoaded">new</button>
        <button @click="handleClickAdd" v-else>add</button>
        <ul>
            <li v-for="subtitle in subtitles" :key="subtitle.cue.id">
                <TranscriptionItem :subtitle="subtitle" />
            </li>
        </ul>
    </div>
    <div v-else>loading...</div>
</template>
<script setup lang="ts">
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';
import TranscriptionItem from './TranscriptionItem.vue';
import { ref, watch } from 'vue';

const videoStore = useVideoStore()
const { subtitles, selectedTranscriptionFileUrl } = storeToRefs(videoStore)

const { isLoadedMetadata } = storeToRefs(videoStore)

const isLoading = ref(true)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value == true) {
        isLoading.value = false
    }
})

function handleClickAdd() {
    videoStore.addCue('[text]', videoStore.getCurrentTime(), videoStore.getCurrentTime() + 2.5)
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
        videoStore.importTextTrack('transcription', selectedTranscriptionFileUrl.value)
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
        videoStore.createEmptyTrack('transcription')
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
    const data = videoStore.exportTrack('transcription')
    await createFile(videoStore.selectedTranscriptionFileUrl, data)
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