<template>
    <div class="bottom-controls">
        <button class="btn-play-pause" :class="{'is-paused': !isPlaying}" @click="togglePlay">
            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
            <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
        </button>
        <Slider v-model="currentTime" :disabled="disabled" :min="min" :max="max" @update:modelValue="handleChange"/>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Slider from '@/transcription-editor/components/Slider.vue';
import { useMediaStore } from '@/shared/media/stores/media';
import { storeToRefs } from 'pinia';

const mediaStore = useMediaStore()
const { isPlaying, currentTime, duration } = storeToRefs(mediaStore)

const disabled = ref(false)
const min = ref(0)
const max = ref(duration)

function togglePlay() {
    if(mediaStore.media.paused) {
        mediaStore.media.play()
    } else {
        mediaStore.media.pause()
    }
}

function handleChange(value: number) {
    mediaStore.media.currentTime = value
}
</script>
<style scoped>
.bottom-controls {
    /* background-color: burlywood; */
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    justify-content: space-between;
    box-shadow: 8px 0px 6px #00000061;
    z-index: 1;
}

.btn-play-pause {
    font-size: 2em;
    display: flex;
    min-width: 54px;
    height: 54px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: none;
    cursor: pointer;
}


.btn-play-pause .pause-icon {
    display: block;
}
.btn-play-pause .play-icon {
    display: none;
}

.btn-play-pause.is-paused .play-icon {
    display: block;
}
.btn-play-pause.is-paused .pause-icon {
    display: none;
}

</style>