<template>
    <div class="main">
        <header class="c-header">
            <h2>{{selectedFileUrl}}</h2>
            <router-link to="/">fechar</router-link> 
        </header>
        
        <div class="c-container">
            <div class="col1">
                <VideoPlayer 
                    class="video-container"
                    :file-url="selectedFileUrl"
                />
             
                <div class="wave-container">
                    <div id="audio-wave-container"></div>
                </div>
             
            </div>
            <Transcription class="col2" />
          
        </div>
        <BottomControls class="c-bottom-controls"></BottomControls>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import BottomControls from '../components/BottomControls.vue'
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

.main {
    position: absolute;
    background-color: aquamarine;
    inset: 0;
    overflow: hidden;
    display: grid;
    /* grid-template-rows: [header-start] 70px [main-start] 1fr [bottom-start] 90px [bottom-end]; */
    grid-template-rows: [header-start] 70px [main-start] minmax(100px, 1fr) [bottom-start] 90px [bottom-end];
    grid-template-columns: auto;
    grid-template-areas: 
        "header"
        "center"
        "bottom";
    justify-items: stretch;

}

.c-header {
    grid-area: header;
}

.c-bottom-controls {
    grid-area: bottom;
}

header {
    background-color: burlywood;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    justify-content: space-between;

}

header h2 {
    font-size: 1em;
    margin: 0;
}

.c-container {
    grid-area: center;
    border: 2px solid red;
    display: flex;
    /* grid-template-columns: [col1-start] 2fr [col2-start] 1fr [col2-end]; */
    grid-template-columns: 3fr minmax(100px, 1fr);
    grid-template-rows: auto;
    grid-template-areas: 
        "col1 col2";
    /* display: flex;
    align-items: stretch;
    justify-content: space-between; */
    /* height: 90vh; */
    /* flex-basis: 100%; */
}

.col1 {
    background-color: #ebe7e7;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 145px;
    grid-template-areas: 
        "video-preview"
        "wave-preview";
    width: 70%;
}

.col2 {
    /* grid-area: col2; */
    /* width: 150px; */
    width: 30%;
}

.wave-container {
    background-color: olivedrab;
    /* width: 100px; */
    overflow: hidden;
    grid-area: wave-preview;
}

.video-container {
    background-color: rgb(67, 35, 142);
    /* width: 100px; */
    overflow: hidden;
    grid-area: video-preview;
}
</style>