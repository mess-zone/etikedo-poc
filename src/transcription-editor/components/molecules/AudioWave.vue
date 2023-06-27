<template>
    <div id="audio-wave-container"></div>
</template>
<script setup lang="ts">
import { useMediaStore } from '@/shared/media/stores/media';
import { storeToRefs } from 'pinia';
import { shallowRef, watch } from 'vue';
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'

const mediaStore = useMediaStore()
const { wavesurferRegions, isLoadedMetadata } = storeToRefs(mediaStore)

const ws = shallowRef<WaveSurfer>(null)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value) {
        console.log('is loaded metadata', isLoadedMetadata)
        // Initialize wavesurfer.js
        ws.value = WaveSurfer.create({
            container: document.querySelector('#audio-wave-container') as HTMLElement, // TODO hardcoded reference? id should be a prop to permit multiple instances of this component
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            // Pass the video element in the `media` param
            media: document.querySelector('video'), // TODO hardcoded reference?
            fillParent: false,
            hideScrollbar: false,
            minPxPerSec: 30,
            barHeight: 1.8,
        })
    
        // Create a Regions plugin instance
        ws.value.registerPlugin(wavesurferRegions.value as RegionsPlugin)
    
        ws.value.on('ready', () => {
            console.log('wavesurfer ready')
        })
    }
})

// TODO destroy wavesurfer.js on onUnmounted hook
</script>