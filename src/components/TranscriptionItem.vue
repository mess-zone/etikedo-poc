<template>
    <div class="transcription-item" :class="{ 'is-active': transcription.isActive }" @click="handleClick">
        <textarea ref="textInput" class="text" v-model="transcription.cue.text" @input="resizeInput($event.target)"></textarea>
        <header>
            <span class="timestamp">
                <!-- <button @click="decrementStart">-</button>
                <button @click="incrementStart">+</button> -->
                {{ formatedStart }} - {{ formatedEnd }}
                <!-- <button @click="decrementEnd">-</button>
                <button @click="incrementEnd">+</button> -->
            </span>
            <button class="btn-remove" @click="handleRemove(transcription, $event)">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
            </button>
        </header>

    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { transcriptionCue, useAudioStore } from '../stores/audio';

const textInput = ref(null)

const props = defineProps<{
    transcription: transcriptionCue
}>()



const videoStore = useAudioStore()

const start = ref(props.transcription.startTime)
const end = ref(props.transcription.endTime)

watch(props.transcription, (newValue: any) => {
    // console.log(`WORKED! new start time`, newValue)
    start.value = newValue.startTime
    end.value = newValue.endTime
});

const formatedStart = computed(()=> {
    return formatDuration(start.value)
})

const formatedEnd = computed(()=> {
    return formatDuration(end.value)
})

// TODO duplicated function
function formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const milliseconds = Math.floor((durationInSeconds % 1) * 1000);
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

const UNIT = 0.5

function decrementStart(e: Event) {
    // e.stopImmediatePropagation()
    if(start.value < 0) {
        // já é negativo
    } else if(start.value >= 0 && start.value < 1) {
        // já é entre 0 e 0.999
    } else {
        // já é maior que zero
        start.value -= UNIT
    
        videoStore.updateStartTime(props.transcription, start.value)
        decrementEnd(e)
    }
}

function incrementStart(e: Event) {
    // e.stopImmediatePropagation()
    start.value += UNIT
    videoStore.updateStartTime(props.transcription, start.value)

    incrementEnd(e)
}

function decrementEnd(e: Event) {
    // e.stopImmediatePropagation()
    end.value -= UNIT
    if(end.value <= start.value) {
        end.value = start.value + UNIT
    }
    videoStore.updateEndTime(props.transcription, end.value)
}

function incrementEnd(e: Event) {
    // e.stopImmediatePropagation()
    end.value += UNIT
    videoStore.updateEndTime(props.transcription, end.value)
}


function resizeInput(target: HTMLTextAreaElement) {
    // @ts-ignore
    target.style.height = "18px";
    // @ts-ignore
    target.style.height = target.scrollHeight + "px";
}

function handleClick() {
    // console.log('click', props.subtitle)
    videoStore.goToTime(props.transcription.startTime)
}

function handleRemove(item: subtitleCue, e: Event) {
    e.stopImmediatePropagation()
    videoStore.removeCue(item)
}

onMounted(() => {
    resizeInput(textInput.value)
})

</script>

<style scoped>

.transcription-item {
    background-color: rgba(255, 192, 203, 0.616);
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 3px solid transparent;
    cursor: pointer;
}

.transcription-item:hover {
    background-color: rgba(255, 192, 203, 0.85);
}

header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.timestamp {
    font-size: .8em;
}
.text {
    font-size: 1em;
    font-family: sans-serif;
    margin: 0;
    margin-top: 5px;
    line-height: 1.5;
    white-space: break-spaces;
    display: block;
    width: 100%;
    background-color: transparent;
    border: none;
    min-height: 18px;
}

.transcription-item.is-active {
    background-color: rgba(255, 113, 184, 0.842);
    border-color: rgba(240, 0, 120, 0.842);
}

.btn-remove {
    font-size: 1em;
    display: flex;
    min-width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: transparent;
}
</style>