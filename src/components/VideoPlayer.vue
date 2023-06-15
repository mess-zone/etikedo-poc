<template>
    <div class="video-container">
        <video
            controls 
            :src="fileUrl"
            ref="media"
        >
            <track
                default
                id="transcription"
                label="transcrição"
                kind="subtitles"
                srclang="pt"
                :src="trackUrl">
        </video>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits(['loadedmetadata'])

defineProps<{
    fileUrl: string,
    trackUrl: string,
}>()

const media = ref(null)

onMounted(() => {
    media.value.addEventListener('loadedmetadata', (e: Event) => {
        console.log('loadedmetadata')
        emit('loadedmetadata', (e.target as HTMLMediaElement).textTracks[0])
    } )
})
</script>

<style scoped>
.video-container {
    background-color: rgb(255, 0, 128);
    display: flex;
}

.video-container video {
    inset: 0;
    max-width: 100%;
    aspect-ratio: 16/9;
}

</style>