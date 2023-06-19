<template>
    <div class="container-editable" :class="[speakerMode]">
        <Utterance v-for="phrase in phrases" :key="phrase.id" :phrase="phrase"></Utterance>
    </div>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue';
import Utterance, { IUtterance } from './Utterance.vue'

const props = defineProps<{
    phrases: IUtterance[]
}>()

const speakerMode = ref<"PREVIEW" | "EDIT">('PREVIEW')

function updateSpeakerMode(mode: "PREVIEW" | "EDIT") {
    speakerMode.value = mode
}

provide('speakerMode', {
    speakerMode,
    updateSpeakerMode
})

</script>
<style scoped>
    .container-editable {
        padding: 20px;
        /* background-color: bisque; */
        font-size: 1em;
    }

    .container-editable.PREVIEW {
        /* background-color: yellow; */
    }
    .container-editable.EDIT {
        /* background-color: rgb(255, 0, 43); */
    }


</style>