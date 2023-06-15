<template>
    <div class="transcription-container">
        <h2>Transcrição</h2>
        <ul>
            <li v-for="subtitle in subtitles" :class="{ 'is-active': subtitle.isActive }" @click="handleClick(subtitle)">
                <!-- <span>{{ subtitle.cue.id }} </span> -->
                <span class="timestamp">
                    {{ formatDuration(subtitle.cue.startTime) }} - {{ formatDuration(subtitle.cue.endTime) }}
                </span>
                <pre class="text" v-html="subtitle.cue.text"></pre></li>
        </ul>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['timeupdate'])

export type subtitleCue = {
    isActive: boolean,
    cue: VTTCue,
}
defineProps<{
    subtitles: subtitleCue[],
}>()

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
    // console.log('clicked', item.cue.startTime)
    emit('timeupdate', item.cue.startTime)
}
</script>
<style scoped>
.transcription-container {
    padding: 20px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background-color: rgba(255, 192, 203, 0.616);
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 3px solid transparent;
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