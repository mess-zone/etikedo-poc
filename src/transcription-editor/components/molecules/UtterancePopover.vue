<template>
    <div class="popover" v-if="phrase" :style="popupPosition">
        <div class="popover-box">
            <button v-if="mode == 'EDIT'" @click="handleExitClick">salvar</button>
            <button v-else @click="handleEditClick">edit</button>
            <input type="number" v-model="editSpeaker" :disabled="mode != 'EDIT'" /> 
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
            <button @click="handleCancelClick">x</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import TimestampSelector from '@/transcription-editor/components/atoms/TimestampSelector.vue';
import { useMediaStore } from '@/shared/media/stores/media';
import { useSelectedUtteranceStore } from '@/transcription-editor/stores/selectedUtterance';
import { LayoutType } from '@/shared/media/composables/track';

const mediaStore = useMediaStore()

const selectedUtteranceStore = useSelectedUtteranceStore()
const { editMode: mode, selectedUtteranceCue: phrase, top, left } = storeToRefs(selectedUtteranceStore)

const editText = ref('')
const editStart = ref(0)
const editEnd = ref(0)
const editLayout = ref('INLINE')
const editSpeaker = ref(-1)

watch(phrase, () => {
    // console.log('a phrase foi alterada?', value)
    if(phrase.value) {
        editText.value = phrase.value.data.text
        editStart.value = phrase.value.data.start
        editEnd.value = phrase.value.data.end
        editLayout.value = phrase.value.data.layout
        editSpeaker.value = phrase.value.data.speaker
    } else {
        editText.value = ''
        editStart.value = 0
        editEnd.value = 0
        editLayout.value = 'INLINE'
        editSpeaker.value = -1
    }
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

const popupPosition = computed(() => ({
    top: top.value + 'px',
    left: left.value + 'px',
}))


function handleCancelClick() {
    cancel()
}

function handleExitClick() {
    exitEditingMode()
}

function handleEditClick() {
    enterEditMode()
}

function handleDeleteClick() {
    mediaStore.removeCue(phrase.value)
    // emit('deleted-cue', phrase.value)
    selectedUtteranceStore.unselect()
}

function cancel() {
    selectedUtteranceStore.unselect()
}

function exitEditingMode(){
    mediaStore.updateText(phrase.value, editText)
    mediaStore.updateStartTime(phrase.value, editStart)
    mediaStore.updateEndTime(phrase.value, editEnd)
    mediaStore.updateLayout(phrase.value, editLayout.value as LayoutType)
    mediaStore.updateSpeaker(phrase.value, editSpeaker)

    // selectedUtteranceStore.setEditMode('PREVIEW')
    selectedUtteranceStore.unselect()
}

function enterEditMode() {
    selectedUtteranceStore.setEditMode('EDIT')
}

</script>

<style scoped>

.popover {
    position: absolute;
    z-index: 1;
    padding-bottom: 0.4em;
    display: block;
    min-width: max-content;
    color: white;
    user-select: none;
    font-size: 1rem;
    transform: translateY(-100%);
}

.popover-box {
    background-color: rgb(137, 43, 226);
    padding: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
}

/* .utterance.EDIT .popover,
.utterance:hover .popover {
    display: block;
} */

</style>