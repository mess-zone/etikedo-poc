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

            <div id="audio-wave-container"></div>
        </div>
        <div class="col2">
            <Transcription />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import Transcription from '../components/Transcription.vue'
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'

// TODO hardcoded
// const trackUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.vtt')

const videoStore = useVideoStore()
const { selectedFileUrl, wafesurferRegions } = storeToRefs(videoStore)

// watch(isLoadedMetadata, () => {
//     if(isLoadedMetadata.value == true) {
//         videoStore.importTextTrack('transcription', trackUrl.value)
//     }
// })


onMounted(() => {

    // Initialize wavesurfer.js
    const ws = WaveSurfer.create({
        container: document.querySelector('#audio-wave-container') as HTMLElement,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        // Pass the video element in the `media` param
        media: document.querySelector('video'),
        fillParent: false,
        hideScrollbar: false,
        minPxPerSec: 30,
        barHeight: 1.8,
    })

    // Create a Regions plugin instance
    ws.registerPlugin(wafesurferRegions.value as RegionsPlugin)

    console.log(wafesurferRegions.value)

    ws.on('ready', () => {
        console.log('wavesurfer ready')
    })

    // Create some regions at specific time ranges
    // ws.on('decode', () => {
    // wsRegions.addRegion({
    //     start: 4.4,
    //     end: 7,
    //     content: 'Blue',
    // })

    // wsRegions.addRegion({
    //     id: 'region-green',
    //     start: 10,
    //     end: 12,
    //     content: 'Green',
    // })

    // wsRegions.addRegion({
    //     start: 19,
    //     content: 'Marker',
    // })
    // })

})

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
    background-color: #ebe7e7;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    max-width: 70%;
}

.col2 {
    min-width: 30%;
}
</style>