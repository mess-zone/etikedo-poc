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
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import Transcription from '../components/Transcription.vue'

const fileUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.mp4')
const trackUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.vtt')

const subtitles = ref<VTTCue[]>([])

function loadedMetadata(subtitleTrack: TextTrack) {
    // @ts-ignore
    subtitles.value = Object.values(subtitleTrack.cues)
}

onMounted(() => {
    // const track = media.value.textTracks[0]
    
    // track.addEventListener("cuechange", () => {
    //     const cues = track.activeCues;
    //     // console.table(cues)
    // });

    // media.value.addEventListener('loadedmetadata', () => {
    //     console.log('loadedmetadata')
    //     console.table(track.cues)
    //     subtitles.value = track.cues
    // } )
})
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