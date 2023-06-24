<template>
    <div class="transcription-container" v-if="!isLoading" :class="theme">
        <header>
            <h2>Transcriptions <button @click="setTheme('estilo-1')">estilo 1</button> <button @click="setTheme('estilo-2')">estilo 2</button></h2>
            <h3>{{ selectedTranscriptionFileUrl }} <button @click="handleSaveTranscription" v-if="isTranscritionTrackLoaded">save</button></h3>
            <button @click="handleImportTrackFile" v-if="!isTranscritionTrackLoaded">import</button>
            <button @click="handleNewTrackFile" v-if="!isTranscritionTrackLoaded">new</button>
            <button @click="handleClickAdd" v-else>add</button>
  
            <!-- {{ track }} -->
        </header>
        <section v-if="loadedTrack && loadedTrack.sortedUtterances">

            <Speaker v-for="speaker in loadedTrack.diarizedUtterances" :key="speaker[0].id" :phrases="speaker"></Speaker>
            
            <!-- <ul>
                <li v-for="utterance in loadedTrack.sortedUtterances" :key="utterance.id">
                    <pre>
                        {{ utterance }}
                    </pre>
                </li>
            </ul> -->
        </section>
    </div>
    <div v-else>loading...</div>
</template>
<script setup lang="ts">
import { useAudioStore } from '../stores/audio';
import { storeToRefs } from 'pinia';
import TranscriptionItem from './TranscriptionItem.vue';
import { computed, ref, watch, provide, MaybeRefOrGetter, toValue } from 'vue';
// import { IUtterance } from './Utterance.vue'
import Speaker from './Speaker.vue'
import { TranscriptionCue } from '../composables/track';

// const phrases = ref<IUtterance[]>([
//     {
//         id: 0,
//         text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non?",
//         speaker: 'Lucas',
//         start: '00:45:89',
//         end: '00:57:13',
//         display: 'display-block',
//     },
//     {
//         id: 1,
//         text: "Deu certo mesmo?",
//         speaker: 'Gilmar Vitor da Silva Andrade',
//         start: '00:45:89',
//         end: '00:57:13',
//         display: 'display-block',
//     },
//     {
//         id: 2,
//         text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non?",
//         speaker: 'Marcos',
//         start: '00:67:07',
//         end: '00:57:13',
//         display: 'display-block',
//     },
//     {
//         id: 3,
//         text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
//         speaker: 'Marcos',
//         start: '00:67:07',
//         end: '00:57:13',
//         display: 'display-inline',
//     },
//     {
//         id: 4,
//         text: "ed dolorem,",
//         speaker: 'Marcos',
//         start: '00:67:07',
//         end: '00:57:13',
//         display: 'display-inline',
//     },
//     {
//         id: 5,
//         text: "autem voluptas error eaque neque",
//         speaker: 'Marcos',
//         start: '00:67:07',
//         end: '00:57:13',
//         display: 'display-inline',
//     },
// ])




const theme = ref('estilo-1')

function setTheme(st: string) {
    theme.value = st
}

const audioStore = useAudioStore()
const { selectedTranscriptionFileUrl, loadedTrack } = storeToRefs(audioStore)

const track = audioStore.loadedTrack


const { isLoadedMetadata } = storeToRefs(audioStore)

const isLoading = ref(true)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value == true) {
        isLoading.value = false
    }
})

function handleClickAdd() {
    audioStore.addCue('', audioStore.getCurrentTime(), audioStore.getCurrentTime() + 2.5)
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
        audioStore.createEmptyTrack()
        // console.log(videoStore.media.textTracks)
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
    const data = audioStore.exportTrack()
    await createTranscriptionFile(audioStore.selectedTranscriptionFileUrl, data)
}

// const speakerMode = ref<"PREVIEW" | "EDIT">('PREVIEW')

// function updateSpeakerMode(mode: MaybeRefOrGetter<"PREVIEW" | "EDIT">) {
//     speakerMode.value = toValue(mode)
// }

provide('track', {
    // speakerMode,
    // updateSpeakerMode,
    loadedTrack,
    updateUtteranceText: loadedTrack.value.updateUtteranceText,
    getUtterance: loadedTrack.value.getUtterance,
    removeUtterance: loadedTrack.value.removeUtterance,
    updateUtteranceStart: loadedTrack.value.updateUtteranceStart,
    updateUtteranceEnd: loadedTrack.value.updateUtteranceEnd,
    updateUtteranceLayout: loadedTrack.value.updateUtteranceLayout,
    updateUtteranceSpeaker: loadedTrack.value.updateUtteranceSpeaker,
})

</script>

<style scoped>
    .container-editable {
        padding: 20px;
        /* background-color: bisque; */
        font-size: 1em;
    }

    .container-editable:has(.utterance.is-editing) .utterance:not(.is-editing) {
        pointer-events: none;
    }
    .container-editable:has(.utterance.is-editing) .utterance:not(.is-editing) .editable {
        opacity: .5;
    }



    .transcription-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        grid-template-areas: 
            "header"
            "center";
        justify-items: stretch;
        overflow: hidden;
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

    ul {
        list-style: none;
        padding: 10px;
        margin: 0;
        /* background-color: aquamarine; */
        /* height: 77vh; */
        overflow-y: auto;
        max-width: 1000px;
        margin: auto;
    }
</style>