<template>
    <h2><router-link to="/">fechar</router-link> {{fileUrl}}</h2>
    <div class="container">
        <div class="col1">
            <VideoPlayer 
                :file-url="fileUrl"
                :track-url="trackUrl"
            />
        </div>
        <div class="col2">
            <Transcription />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import Transcription from '../components/Transcription.vue'
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';

const fileUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.mp4')
const trackUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.vtt')

const videoStore = useVideoStore()
const { isLoadedMetadata } = storeToRefs(videoStore)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value == true) {
        // console.log('finalmente metadata está loaded')
        // console.log('TEXT TRACKS', videoStore.getTextTracks())
        videoStore.loadTrack('transcription')
    }
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