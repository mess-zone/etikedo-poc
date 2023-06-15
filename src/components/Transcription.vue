<template>
    <div class="transcription-container">
        <h2>Transcrição</h2>
        <button @click="handleClickAdd">add</button>
        <ul>
            <li v-for="subtitle in subtitles" :key="subtitle.cue.id">
                <TranscriptionItem  :subtitle="subtitle"/>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';
import TranscriptionItem from './TranscriptionItem.vue';

const videoStore = useVideoStore()
const { subtitles } = storeToRefs(videoStore)

function handleClickAdd() {
    videoStore.addCue('text', videoStore.getCurrentTime(), videoStore.getCurrentTime() + 10)
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