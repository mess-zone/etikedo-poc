<template>
    <div class="main">
        <header class="c-header">
            <h2>{{selectedFileUrl}}</h2>
            <router-link to="/">fechar</router-link> 
        </header>
        
        <div class="c-container">
            <Transcriptions class="transcription-container"/>

            <AudioPlayer 
                class="video-container"
                :file-url="selectedFileUrl"
            />
            
            <div class="wave-container">
                <div id="audio-wave-container"></div>
            </div>
        </div>
        <AudioBottomControls class="c-bottom-controls"></AudioBottomControls>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import AudioPlayer from '../components/AudioPlayer.vue'
import AudioBottomControls from '../components/AudioBottomControls.vue'
import { useMediaStore } from '../stores/media';
import { storeToRefs } from 'pinia';
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'
import Transcriptions from '../components/Transcriptions.vue';

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
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr 54px 145px;
    grid-template-areas: 
        "transcription"
        "audio-preview"
        "wave-preview";
}

.wave-container {
    overflow: hidden;
    grid-area: wave-preview;
}

.video-container {
    overflow: hidden;
    grid-area: audio-preview;
}

.transcription-container {
    grid-area: transcription;
    overflow: auto;
}
</style>