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
            <Captions class="col2" />
          
        </div>
        <VideoBottomControls class="c-bottom-controls"></VideoBottomControls>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import VideoBottomControls from '../components/VideoBottomControls.vue'
import Captions from '../components/Captions.vue'
import { useMediaStore } from '../stores/media';
import { storeToRefs } from 'pinia';
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'

const mediaStore = useMediaStore()
const { selectedFileUrl, wavesurferRegions } = storeToRefs(mediaStore)

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
    ws.registerPlugin(wavesurferRegions.value as RegionsPlugin)

    ws.on('ready', () => {
        console.log('wavesurfer ready')
    })

})

onUnmounted(() => {
    // console.log('video unmonted')
    mediaStore.$reset()
})

</script>

<style scoped>

.main {
    position: absolute;
    inset: 0;
    overflow: hidden;
    display: grid;
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
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    justify-content: space-between;
    box-shadow: 8px 0px 6px #00000061;
    z-index: 1;
}

header h2 {
    font-size: 1em;
    margin: 0;
}

.c-container {
    grid-area: center;
    display: flex;
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
    width: 30%;
}

.wave-container {
    overflow: hidden;
    grid-area: wave-preview;
}

.video-container {
    overflow: hidden;
    grid-area: video-preview;
}
</style>