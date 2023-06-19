<template>
    <div class="container-editable" :class="{ 'is-editing': speakerModeIsEditing }">
        <Utterance v-for="phrase in phrases" :key="phrase.id" :phrase="phrase" @mode:changed="modeChanged" ></Utterance>
    </div>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue';
import Utterance, { IUtterance, ModeType } from './Utterance.vue'

const props = defineProps<{
    phrases: IUtterance[]
}>()

const speakerModeIsEditing = ref(false)

function updateSpeakerMode(value: boolean) {
    speakerModeIsEditing.value = value
}

provide('speakerMode', {
    speakerModeIsEditing,
    updateSpeakerMode
})


function modeChanged(mode: ModeType) {
    // if(mode == 'EDIT') {
    //     speakerModeIsEditing.value = true
    // } else {
    //     speakerModeIsEditing.value = false
    // }
}


</script>
<style scoped>
    .container-editable {
        padding: 20px;
        /* background-color: bisque; */
        font-size: 1em;
    }

    /**
        // TODO hover not working
     */

    .container-editable:has(.utterance.is-editing) .utterance:not(.is-editing) {
        pointer-events: none;
    }
    .container-editable:has(.utterance.is-editing) .utterance:not(.is-editing) .editable {
        opacity: .5;
    }

    .container-editable.is-editing {
        background-color: rgb(0, 195, 255);
        /* pointer-events: none; */
        /* opacity: .2; */
    }

    .container-editable.is-editing {
        /* background-color: aquamarine; */
    }


</style>