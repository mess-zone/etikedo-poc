<template>
    <div class="transcription-container">
        <h2>Transcrição</h2>
        <ul>
            <li v-for="cue in subtitles">
                <span class="timestamp">
                    {{ formatDuration(cue.startTime) }} - {{ formatDuration(cue.endTime) }}
                </span>
                <pre class="text" v-html="cue.text"></pre></li>
        </ul>
    </div>
</template>
<script setup lang="ts">

defineProps<{
    subtitles: VTTCue[],
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
</style>