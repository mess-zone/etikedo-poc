<template>
    <h2>
        <router-link to="/">fechar</router-link> 
        {{selectedFileUrl}}
        <button @click="handleSave">save</button>
    </h2>
    
    <div class="container">
        <div class="col1">
            <VideoPlayer 
                :file-url="selectedFileUrl"
                :track-url="trackUrl"
            />
        </div>
        <div class="col2">
            <Transcription />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue'
import Transcription from '../components/Transcription.vue'
import { useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';

const trackUrl = ref('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\video1.vtt')

const videoStore = useVideoStore()
const { isLoadedMetadata, selectedFileUrl } = storeToRefs(videoStore)

watch(isLoadedMetadata, () => {
    if(isLoadedMetadata.value == true) {
        videoStore.loadTrack('transcription')
    }
})

const electronAPI = window.electronAPI

async function createFile(path: string, data: any) {
  const response = await electronAPI.createFile(path, data)
  console.log(response)
}

async function handleSave() {
    console.log('save')
    const data = videoStore.exportTrack('transcription')
    await createFile('D:\\gilma\\Documents\\PROJETOS\\MESS-ZONE\\etikedo-poc\\test\\videos\\teste.vtt', data)
}

onMounted(() => {
    console.log(selectedFileUrl)
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