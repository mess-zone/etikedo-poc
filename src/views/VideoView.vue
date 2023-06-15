<template>
    <h2><router-link to="/">fechar</router-link> {{fileUrl}}</h2>
    <div class="container">
        <div class="col1">
            <VideoPlayer 
                :file-url="fileUrl"
                :track-url="trackUrl"
                @loadedmetadata="loadedMetadata"
            />
        </div>
        <div class="col2">
            <Transcription
                :subtitles="subtitles"
                @timeupdate="goToTime"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import Transcription, { subtitleCue } from '../components/Transcription.vue'

const fileUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.mp4')
const trackUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.vtt')

const subtitles = ref<subtitleCue[]>([])

function loadedMetadata(subtitleTrack: TextTrack) {
    // @ts-ignore
    subtitles.value = Object.values(subtitleTrack.cues).map(c => ({ isActive: false, cue: c }))

    for(const subtitle of subtitles.value) {
        subtitle.cue.addEventListener("enter", (event) => {
            subtitle.isActive = true
        });
        subtitle.cue.addEventListener("exit", (event) => {
            subtitle.isActive = false
        });
    }
}

function goToTime(seconds: number) {
    console.log('go to', seconds)
}
</script>

<style scoped>
.container {
    display: flex;
    height: 90vh;
    align-items: stretch;
    justify-content: space-between;
}

.col1 {
    background-color: gray;
    display: flex;
}

.col2 {
    min-width: 30%;
}
</style>