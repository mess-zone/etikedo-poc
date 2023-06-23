<template>
    <span class="utterance" :class="[ mode, phrase.data.layout ]">
        <contenteditable class="editable" tag="span" :contenteditable="mode == 'EDIT'" v-model="text" :no-nl="true" :no-html="true" @returned="keyEnterPressed" />
        <div class="popover">
            <div class="popover-box">
                <button v-if="mode == 'EDIT'" @click="handleExitClick">salvar</button>
                <button v-else @click="handleEditClick">edit</button>
                <input type="number" v-model="speaker" :disabled="mode != 'EDIT'" /> 
                <div class="time-widget" v-if="mode == 'EDIT'">
                    <TimestampSelector v-model="start" :min="0" :step="timeStep"/>
                    <TimestampSelector v-model="end" :min="start" :step="timeStep"/>
                </div>
                <div v-else>
                    {{ formatedStart }} - {{ formatedEnd }}
                </div>
                <select v-model="layout" :disabled="mode !== 'EDIT'">
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
import { LayoutType, TranscriptionCue, UtteranceData } from '../composables/track';
import TimestampSelector from '../components/TimestampSelector.vue';


const props = defineProps<{
    phrase: TranscriptionCue,
}>()

// const { text } = toRefs(props.phrase) // ref 'text' is synced with 'props'
const text = ref(props.phrase.data.text) // ref 'text' is not synced with 'props'
const start = ref(props.phrase.data.start)
const end = ref(props.phrase.data.end)
const layout = ref(props.phrase.data.layout)
const speaker = ref(props.phrase.data.speaker)

const timeStep = 0.5

// watch(text, (value) => {
//     console.log('estou editando o texto?', text, value)
// })

// TOD use props?
const { speakerMode, updateSpeakerMode } = inject<{ 
    speakerMode: Ref<"PREVIEW" | "EDIT">, 
    updateSpeakerMode: (mode: MaybeRefOrGetter<"PREVIEW" | "EDIT">) => void,
 }>('speaker')

const { updateUtteranceText, getUtterance, removeUtterance, updateUtteranceStart, updateUtteranceEnd, updateUtteranceLayout, updateUtteranceSpeaker } = inject<{ 
    updateUtteranceText: (id: MaybeRefOrGetter<string>, text: MaybeRefOrGetter<string>) => void,
    getUtterance: (id: MaybeRefOrGetter<string>) => Ref<UtteranceData>,
    removeUtterance: (item: MaybeRefOrGetter<TranscriptionCue>) => void,
    updateUtteranceStart: (id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<number>) => void,
    updateUtteranceEnd: (id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<number>) => void,
    updateUtteranceLayout: (id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<LayoutType>) => void,
    updateUtteranceSpeaker: (id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<number>) => void,
 }>('track')

watch(speakerMode, () => {
    if(speakerMode.value == 'EDIT') {
        if(mode.value != 'EDIT') {
            mode.value = 'DISABLED'
        }
    } else {
        mode.value = 'PREVIEW'
    }
})

watch(start, (newValue, oldValue) => {
    end.value = end.value + newValue - oldValue
    // console.log('start changed, new end:', end.value)
})

const formatedStart = computed(() => {
    return formatDuration(start.value)
})

const formatedEnd = computed(() => {
    return formatDuration(end.value)
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

// watch(end, () => {
//     console.log('end changed', end)
// })

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
    removeUtterance(props.phrase)
    updateSpeakerMode('PREVIEW')
}

function exitEditingMode(){
    updateUtteranceText(props.phrase.id, text)
    updateUtteranceStart(props.phrase.id, start)
    updateUtteranceEnd(props.phrase.id, end)
    updateUtteranceLayout(props.phrase.id, layout)
    updateUtteranceSpeaker(props.phrase.id, speaker)
    updateSpeakerMode('PREVIEW')
}

function enterEditMode() {
    mode.value = 'EDIT'
    updateSpeakerMode('EDIT')
}

</script>

<style scoped>

.utterance {
    position: relative;
    /* border: 1px solid red; */
    min-height: 1.5em;
    min-width: 52px;
}

.utterance.PREVIEW {
    /* background-color: yellow !important; */
    /* cursor: pointer; */
}
.utterance.EDIT {
    /* background-color: rgb(255, 0, 43) !important; */
}
.utterance.DISABLED {
    /* background-color: rgb(0, 195, 255) !important; */
    pointer-events: none;
    opacity: .4;
}

.utterance.INLINE {
    display: inline;
    margin-right: 0.25em;
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