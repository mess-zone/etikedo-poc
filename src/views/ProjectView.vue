<template>
    <div class="main">
        <header class="c-header">
            <div>
                <h1>{{ configuration.project }}</h1>
                <h2>{{ configuration.createdAt }}</h2>
            </div>

            <router-link to="/">fechar</router-link> 
        </header>
        
        <div class="c-container">
            <div class="col1">
                <VideoPlayer 
                    class="video-container"
                />
             
                <div class="wave-container">
                    <AudioWave/>
                </div>
             
            </div>
            <!-- <Captions class="col2" /> -->
          
        </div>
        <VideoBottomControls class="c-bottom-controls"></VideoBottomControls>
    </div>
</template>
<script setup lang="ts">
import VideoPlayer from '../components/VideoPlayer.vue'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaStore } from '../stores/media';
import { storeToRefs } from 'pinia';
import VideoBottomControls from '../components/VideoBottomControls.vue'
import AudioWave from '../components/AudioWave.vue'

interface ProjectConfig {
    project: string,
    createdAt: Date,
    version: string,
    type: string,
    resource: string,
    transcription?: {
        json?: string,
        vtt?: string,
    }
}

const route = useRoute()

// @ts-ignore
const electronAPI = window.electronAPI

const configuration = ref<ProjectConfig>({
    project: '',
    createdAt: null,
    version: '',
    type: '',
    resource: '',
})

const folderPath = ref('')

async function openConfigFile(fullPath: string) {

    console.log('OPEN CONFIG FILE', fullPath)
    // TODO readCOnfigFile should return a json with absolute paths configured
    const content = await electronAPI.readFile(fullPath)
    configuration.value = JSON.parse(content)
}

const mediaStore = useMediaStore()
const { selectedFileUrl, wavesurferRegions, isLoadedMetadata } = storeToRefs(mediaStore)

onMounted(async () => {
    const path = route.query.path.toString()
    await openConfigFile(path)
    folderPath.value = path.replace('config.etikedo.json', '')
    mediaStore.selectedFileUrl = folderPath.value + configuration.value.resource
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

header h1 {
    font-size: 1.5em;
    margin: 0;
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