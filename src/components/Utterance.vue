<template>
    <span class="utterance" :class="[ mode, phrase.data.layout, phrase.isActive ? 'is-active' : '' ]" @click="handleUtteranceClick">
        <contenteditable class="editable" tag="span" :contenteditable="mode == 'EDIT'" v-model="editText" :no-nl="true" :no-html="true" @returned="keyEnterPressed" />
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
    </span>
</template>
<script setup lang="ts">
import { MaybeRefOrGetter, Ref, computed, inject, ref, toRefs, watch } from 'vue';
import contenteditable from 'vue-contenteditable'
import { TranscriptionCue } from '../composables/track';
import TimestampSelector from '../components/TimestampSelector.vue';
import { useMediaStore } from '../stores/media';

const mediaStore = useMediaStore()

const props = defineProps<{
    phrase: TranscriptionCue,
}>()

const { phrase } = toRefs(props) // ref 'text' is synced with 'props'

const editText = ref(phrase.value.data.text)
const editStart = ref(phrase.value.data.start)
const editEnd = ref(phrase.value.data.end)
const editLayout = ref(phrase.value.data.layout)
const editSpeaker = ref(phrase.value.data.speaker)

watch(props.phrase, (value) => {
    // console.log('a phrase foi alterada?', value)
    editText.value = phrase.value.data.text
    editStart.value = phrase.value.data.start
    editEnd.value = phrase.value.data.end
    editLayout.value = phrase.value.data.layout
    editSpeaker.value = phrase.value.data.speaker
})

const timeStep = 0.5


// TODO usar props e emit para comunicação entre Speaker e Utterance
const { speakerMode, updateSpeakerMode } = inject<{ 
    speakerMode: Ref<"PREVIEW" | "EDIT">, 
    updateSpeakerMode: (mode: MaybeRefOrGetter<"PREVIEW" | "EDIT">) => void,
 }>('speaker')


watch(speakerMode, () => {
    if(speakerMode.value == 'EDIT') {
        if(mode.value != 'EDIT') {
            mode.value = 'DISABLED'
        }
    } else {
        mode.value = 'PREVIEW'
    }
})

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

const mode = ref<ModeType>('PREVIEW') 

function keyEnterPressed() {
    exitEditingMode()
}

function handleExitClick() {
    exitEditingMode()
}

function handleEditClick() {
    enterEditMode()
}

function handleDeleteClick() {
    mediaStore.removeCue(props.phrase)
    updateSpeakerMode('PREVIEW')
}

function exitEditingMode(){
    mediaStore.updateText(props.phrase, editText)
    mediaStore.updateStartTime(props.phrase, editStart)
    mediaStore.updateEndTime(props.phrase, editEnd)
    mediaStore.updateLayout(props.phrase, editLayout)
    mediaStore.updateSpeaker(props.phrase, editSpeaker)
    updateSpeakerMode('PREVIEW')
}

function enterEditMode() {
    mode.value = 'EDIT'
    updateSpeakerMode('EDIT')
}

function handleUtteranceClick() {
    console.log('utterance click')
    mediaStore.goToTime(phrase.value.data.start)
}

</script>

<style scoped>

.utterance {
    position: relative;
    /* border: 1px solid red; */
    min-height: 1.5em;
    min-width: 52px;
    cursor: pointer;
}

.utterance.is-active {
    background-color: rgba(137, 43, 226, 0.507);
}

.utterance.PREVIEW {
    /* background-color: yellow !important; */
    /* cursor: pointer; */
}
.utterance.EDIT {
    cursor: text;
    /* background-color: rgb(255, 0, 43) !important; */
}
.utterance.DISABLED {
    /* background-color: rgb(0, 195, 255) !important; */
    pointer-events: none;
    opacity: .4;
}

.utterance.INLINE {
    display: inline;
    /* margin-right: 0.25em; */
}

.utterance.INLINE::after {
    content: ' ';
}

.utterance.BLOCK {
    display: block;
    margin-top: 1em;
    margin-bottom: 1em;
}

.utterance.EDIT {
    outline: 2px solid rgb(137, 43, 226);
    outline-offset: 0.25em;
    border-radius: 0.25em;
}

.utterance.EDIT:has(.editable:focus) {
    /* background-color: green; */
    /* box-shadow: 0px 0 6px 4px rgb(14 223 0); */
    outline-color: rgb(226, 177, 43);
}

.editable {
    /* background-color: pink; */
    line-height: 1.5em;
    /* outline-offset: 5px; */
    outline: none;
    border-bottom: 3px solid transparent;
}

.utterance.PREVIEW:hover .editable {
    border-bottom-color: rgb(137, 43, 226);
}

.utterance .editable:empty:before {
    content: '[empty]';
    opacity: .4;
}

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