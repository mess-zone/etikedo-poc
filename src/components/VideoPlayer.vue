<template>
    <div class="video-container">
        <video
            controls 
            :src="fileUrl"
            ref="media"
        >
        </video>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVideoStore } from '../stores/video';

const videoStore = useVideoStore()

defineProps<{
    fileUrl: string
}>()

const media = ref(null)

onMounted(() => {
    videoStore.setMedia(media.value)
})
</script>

<style scoped>
.video-container {
    background-color: rgb(255, 0, 128);
    display: flex;
    height: 100%;
}

.video-container video {
    inset: 0;
    max-height: 100%;
    max-width: 100%;
    /* aspect-ratio: 16/9; */
}

</style>