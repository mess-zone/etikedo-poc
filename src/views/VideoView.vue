<template>
    <h2>
        <router-link to="/">fechar</router-link> 
        {{selectedFileUrl}}
    </h2>
    
    <div class="container">
        <div class="col1">
            <VideoPlayer 
                :file-url="selectedFileUrl"
            />
        </div>
        <div class="col2">
            <Transcription />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onUnmounted } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import Transcription from '../components/Transcription.vue'
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';

// TODO hardcoded
// const trackUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.vtt')

const videoStore = useVideoStore()
const { selectedFileUrl } = storeToRefs(videoStore)

// watch(isLoadedMetadata, () => {
//     if(isLoadedMetadata.value == true) {
//         videoStore.importTextTrack('transcription', trackUrl.value)
//     }
// })


// onMounted(() => {
//     console.log(selectedFileUrl)
// })

onUnmounted(() => {
    // console.log('video unmonted')
    videoStore.$reset()
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