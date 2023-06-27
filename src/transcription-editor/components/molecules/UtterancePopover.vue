<template>
    <div class="popover">
        <div class="popover-box">
            <button v-if="mode == 'EDIT'" @click="handleExitClick">salvar</button>
            <button v-else @click="handleEditClick">edit</button>
            <input type="number" v-model="editSpeaker" :disabled="mode != 'EDIT'" /> 
            ({{ props.phrase.data.start }} / {{ props.phrase.data.end }})
            <div class="time-widget" v-if="mode == 'EDIT'">
                <TimestampSelector v-model="editStart" :min="0" :step="timeStep"/>
                <TimestampSelector v-model="editEnd" :min="editStart" :step="timeStep"/>
            </div>
            <div v-else>
                {{ formatedStart }} - {{ formatedEnd }}
            </div>
            <select v-model="editLayout" :disabled="mode !== 'EDIT'">
                <option>INLINE</option>
                <option>BLOCK</option>
            </select>
            <button v-if="mode == 'EDIT'" @click="handleDeleteClick">delete</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import { TranscriptionCue } from '@/shared/media/composables/track';
import TimestampSelector from '@/transcription-editor/components/atoms/TimestampSelector.vue';


const emit = defineEmits(['enter-edit-mode', 'exit-edit-mode', 'deleted-cue'])

const props = defineProps<{
    phrase: TranscriptionCue,
    mode: ModeType,
}>()

const { phrase } = toRefs(props) // ref is synced with 'props'

const editText = ref(phrase.value.data.text)
const editStart = ref(phrase.value.data.start)
const editEnd = ref(phrase.value.data.end)
const editLayout = ref(phrase.value.data.layout)
const editSpeaker = ref(phrase.value.data.speaker)

watch(props.phrase, () => {
    // console.log('a phrase foi alterada?', value)
    editText.value = phrase.value.data.text
    editStart.value = phrase.value.data.start
    editEnd.value = phrase.value.data.end
    editLayout.value = phrase.value.data.layout
    editSpeaker.value = phrase.value.data.speaker
})

const timeStep = 0.5

watch(editStart, (newValue, oldValue) => {
    editEnd.value = editEnd.value + newValue - oldValue
})

const formatedStart = computed(() => {
    return formatDuration(editStart.value)
})

const formatedEnd = computed(() => {
    return formatDuration(editEnd.value)
})

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

export type ModeType = 'PREVIEW' | 'EDIT' | 'DISABLED'

function handleExitClick() {
    exitEditingMode()
}

function handleEditClick() {
    enterEditMode()
}

function handleDeleteClick() {
    emit('deleted-cue', props.phrase)
}

function exitEditingMode(){
    emit('exit-edit-mode', {
        id: props.phrase.id,
        text: editText.value,
        start: editStart.value,
        end: editEnd.value,
        layout: editLayout.value,
        speaker: editSpeaker.value,
    })
}

function enterEditMode() {
    emit('enter-edit-mode')
}

</script>

<style scoped>

.popover {
    position: absolute;
    bottom: 100%;
    left: 0;
    z-index: 1;
    padding-bottom: 0.4em;
    display: none;
    min-width: max-content;
    color: white;
    user-select: none;
    font-size: 1rem;
}

.popover-box {
    background-color: rgb(137, 43, 226);
    padding: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.utterance.EDIT .popover,
.utterance:hover .popover {
    display: block;
}

</style>