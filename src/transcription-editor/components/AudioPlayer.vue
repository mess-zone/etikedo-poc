<template>
    <div class="video-container">
        <!--
            // TODO replace video tab by audio tag?
        -->
        <video
            controls 
            :src="selectedFileUrl"
            ref="media"
        >
        </video>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMediaStore } from '@/shared/media/stores/media';
import { storeToRefs } from 'pinia';

const mediaStore = useMediaStore()
const { selectedFileUrl } = storeToRefs(mediaStore)

const media = ref(null)

onMounted(() => {
    mediaStore.setMedia(media.value)
})
</script>

<style scoped>
.video-container {
    background-color: rgb(51, 51, 51);
    /* display: flex; */
    /* height: 100%; */
    /* width: 100%; */
    position: relative;

}

.video-container video {
    /* inset: 0; */
    /* max-width: 100%;
    max-height: 100%; */
    width: 100%;
    height: 100%;
    position: absolute;
}

</style>