<template>
    <h1>
        track id: <input type="text" v-model="id">
    </h1>

    <div>
        <label>
            text
            <input type="text" v-model="utteranceToAdd.text">
        </label>
        <label>
            start
            <input type="number" v-model="utteranceToAdd.start">
        </label>
        <label>
            end
            <input type="number" v-model="utteranceToAdd.end">
        </label>
        <label>
            speaker
            <input type="number" v-model="utteranceToAdd.speaker">
        </label>
        <label>
            layout
            <input type="text" v-model="utteranceToAdd.layout">
        </label>
        <button @click="handleAddClick">add</button>
    </div>
    
    <Speaker :phrases="utterances"></Speaker>
    <ul>
        <li v-for="item in utterances" :key="item.id">
            <pre>{{ item }}</pre>
            <button @click="handleRemoveClick(item)">remove</button>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { MaybeRefOrGetter, provide, ref, toValue } from 'vue';
import { UtteranceData, useTrack } from '../composables/track';
import Speaker from '../components/Speaker.vue'

const { id, utterances, removeUtterance, addUtterance, getUtterance, updateUtteranceText, updateUtteranceStart, updateUtteranceEnd } = useTrack()

const utteranceToAdd = ref<UtteranceData>({
    id: null,
    text: '',
    start: 0,
    end: 0,
    speaker: 0,
    layout: 'INLINE',
})

function handleAddClick() {
    console.log('add', utteranceToAdd.value)
    
    addUtterance(utteranceToAdd)

    utteranceToAdd.value = {
        id: null,
        text: '',
        start: 0,
        end: 0,
        speaker: 0,
        layout: 'INLINE',
    }
}

function handleRemoveClick(item: UtteranceData) {
    console.log('remove', item)
    removeUtterance(item)
}

const speakerMode = ref<"PREVIEW" | "EDIT">('PREVIEW')

function updateSpeakerMode(mode: MaybeRefOrGetter<"PREVIEW" | "EDIT">) {
    speakerMode.value = toValue(mode)
}

provide('speaker', {
    speakerMode,
    updateSpeakerMode,
    updateUtteranceText,
    getUtterance,
    removeUtterance,
    updateUtteranceStart,
    updateUtteranceEnd,
})
</script>
<style scoped>
    .container-editable {
        max-width: 1000px;
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