<template>
    <div class="transcription-item" :class="{ 'is-active': subtitle.isActive }" @click="handleClick(subtitle)">
        <!-- <span>{{ subtitle.cue.id }} </span> -->
        <span class="timestamp">
            {{ start }}/{{ end }}
        {{ formatedStart }} - {{ formatedEnd }}
        </span>
        <textarea class="text" v-model="subtitle.cue.text" @input="resizeInput"></textarea>
        <button @click="handleRemove(subtitle, $event)">remove</button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { subtitleCue, useVideoStore } from '../stores/video';

const props = defineProps<{
    subtitle: subtitleCue
}>()

const videoStore = useVideoStore()

const start = ref(props.subtitle.cue.startTime)
const end = ref(props.subtitle.cue.endTime)

const formatedStart = computed(()=> {
    return formatDuration(start.value)
})

const formatedEnd = computed(()=> {
    return formatDuration(end.value)
})

function formatDuration(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


function resizeInput(e: Event) {
    console.log('resize input', e)
    e.target
    // @ts-ignore
    e.target.style.height = "18px";
    // @ts-ignore
    e.target.style.height = e.target.scrollHeight + "px";
}

function handleClick(item: subtitleCue) {
    console.log('click', item)
    videoStore.goToTime(item.cue.startTime)
}

function handleRemove(item: subtitleCue, e: Event) {
    e.stopImmediatePropagation()
    videoStore.removeCue(item)
}

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

</style>