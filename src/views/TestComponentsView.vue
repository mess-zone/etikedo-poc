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
    
    <ul>
        <li v-for="item in utterances" :key="item.id">
            <pre>{{ item }}</pre>
            <button @click="handleRemoveClick(item)">remove</button>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useTrack } from '../composables/track';
import { UtteranceData } from '../composables/utterance';

const { id, utterances, removeUtterance, addUtterance } = useTrack()

const utteranceToAdd = ref<UtteranceData>({
    id: null,
    text: '[EMPTY]',
    start: 0,
    end: 0,
    speaker: 0,
    layout: 'BLOCK',
})

function handleAddClick() {
    console.log('add', utteranceToAdd.value)
    
    addUtterance(utteranceToAdd)

    utteranceToAdd.value = {
        id: null,
        text: '[EMPTY]',
        start: 0,
        end: 0,
        speaker: 0,
        layout: 'BLOCK',
    }
}

function handleRemoveClick(item: UtteranceData) {
    console.log('remove', item)
    removeUtterance(item)
}
</script>