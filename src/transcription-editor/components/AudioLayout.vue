<template>
    <div class="main">
        <header class="c-header">
            <div>
                <h1>{{ configuration.project }}</h1>
                <h2>{{ configuration.createdAt }}</h2>
            </div>
            <button @click="() => { $router.go(-1) }">fechar</button>
        </header>
        
        <div class="c-container">
            <Transcription class="col2" />

            <AudioPlayer 
                class="video-container"
            />
            
            <div class="wave-container">
                    <AudioWave/>
            </div>
        </div>
        <AudioBottomControls class="c-bottom-controls"></AudioBottomControls>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectConfig } from '@/stores/projectConfig';
import AudioPlayer from '@/transcription-editor/components/AudioPlayer.vue'
import AudioWave from '@/transcription-editor/components/AudioWave.vue'
import AudioBottomControls from '@/transcription-editor/components/AudioBottomControls.vue'
import Transcription from '@/transcription-editor/components/Transcription.vue'


const projectConfig = useProjectConfig()
const { configuration } = storeToRefs(projectConfig)

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