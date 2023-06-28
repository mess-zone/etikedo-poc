<template>
    <div class="speaker">
        <div class="actor">
            <div class="avatar" :style="avatarStyle">{{ phrases[0].data.speaker }}</div>
        </div>
        <div class="container-utterances">
            <Utterance v-for="phrase in phrases" :key="phrase.id" :phrase="phrase"></Utterance>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { TranscriptionCue } from '@/shared/media/composables/track';
import Utterance from '@/transcription-editor/components/molecules/Utterance.vue';

const props = defineProps<{
    phrases: TranscriptionCue[]
}>()

const avatarStyle = computed(() => {
    return {
        'background-color': stringToHexColor(''.padStart(5, ''+props.phrases[0].data.speaker))
    }
})

function stringToHexColor(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Converte para um inteiro de 32 bits
  }

  let color = "#";

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}

</script>
<style scoped>

    .speaker {
        /* background-color: red; */
        display: flex;
        padding: 20px;
        gap: 10px;
        font-size: 1em;
    }

    .actor {
        /* width: 32px; */
        height: 2em;
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    .avatar {
        font-size: 1rem;
        width: 32px;
        height: 32px;
        background-color: turquoise;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        text-transform: uppercase;
    }


    .container-utterance {
        /* background-color: bisque; */

        margin-top: 0.25em;
    }

    .container-utterance :first-child {
        /* background-color: aqua; */
        margin-top: 0;
    }


</style>