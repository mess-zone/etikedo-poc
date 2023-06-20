<template>
    <div class="speaker">
        <div class="actor">
            <div class="avatar">a</div>
        </div>
        <div class="container-editable" :class="[speakerMode]">
            <Utterance v-for="phrase in phrases" :key="phrase.id" :phrase="phrase"></Utterance>
        </div>
    </div>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue';
import { UtteranceData } from '../composables/track';
import Utterance from './Utterance.vue';

const props = defineProps<{
    phrases: UtteranceData[]
}>()

const speakerMode = ref<"PREVIEW" | "EDIT">('PREVIEW')

function updateSpeakerMode(mode: "PREVIEW" | "EDIT") {
    speakerMode.value = mode
}

provide('speakerMode', {
    speakerMode,
    updateSpeakerMode,
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


    .container-editable {
        /* background-color: bisque; */

        margin-top: 0.25em;
    }

    .container-editable.PREVIEW {
        /* background-color: yellow; */
    }
    .container-editable.EDIT {
        /* background-color: rgb(255, 0, 43); */
    }

    .container-editable :first-child {
        /* background-color: aqua; */
        margin-top: 0;
    }


</style>