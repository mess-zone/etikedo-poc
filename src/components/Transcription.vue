<template>
    <div class="transcription-container">
        <h2>Transcrição</h2>
        <button @click="handleClickAdd">add</button>
        <ul>
            <li v-for="subtitle in subtitles" :class="{ 'is-active': subtitle.isActive }" @click="handleClick(subtitle)">
                <!-- <span>{{ subtitle.cue.id }} </span> -->
                <span class="timestamp">
                    {{ formatDuration(subtitle.cue.startTime) }} - {{ formatDuration(subtitle.cue.endTime) }}
                </span>
                <pre class="text" v-html="subtitle.cue.text"></pre>
                <button @click="handleRemove(subtitle, $event)">remove</button>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { subtitleCue, useVideoStore } from '../stores/video';
import { storeToRefs } from 'pinia';

const videoStore = useVideoStore()
const { subtitles } = storeToRefs(videoStore)

function formatDuration(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function handleClick(item: subtitleCue) {
    console.log('click', item)
    videoStore.goToTime(item.cue.startTime)
}

function handleClickAdd() {
    videoStore.addCue('text', videoStore.getCurrentTime(), videoStore.getCurrentTime() + 10)
}

function handleRemove(item: subtitleCue, e: Event) {
    e.stopImmediatePropagation()
    videoStore.removeCue(item)
}

</script>
<style scoped>
.transcription-container {
    padding: 20px;
}

ul {
    list-style: none;
    padding: 0;
    /* background-color: aquamarine; */
    max-height: 77vh;
    overflow-y: auto;
}

li {
    background-color: rgba(255, 192, 203, 0.616);
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 3px solid transparent;
    cursor: pointer;
}

li:hover {
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
}

li.is-active {
    background-color: rgba(255, 113, 184, 0.842);
    border-color: rgba(240, 0, 120, 0.842);
}
</style>