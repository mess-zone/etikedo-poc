<template>
    <span class="utterance" :class="[ mode, phrase.data.layout, phrase.isActive ? 'is-active' : '' ]" @click="handleUtteranceClick">
        <contenteditable class="editable" tag="span" :contenteditable="mode == 'EDIT'" v-model="editText" :no-nl="true" :no-html="true" @returned="keyEnterPressed" />
        <UtterancePopover :mode="mode" :phrase="phrase" @enter-edit-mode="enterEditMode" @exit-edit-mode="exitEditingMode" @deleted-cue="handleDeleteClick" />
    </span>
</template>
<script setup lang="ts">
import { MaybeRefOrGetter, Ref, computed, inject, ref, toRefs, watch } from 'vue';
import contenteditable from 'vue-contenteditable'
import { TranscriptionCue, UtteranceData } from '@/shared/media/composables/track';
import UtterancePopover from '@/transcription-editor/components/molecules/UtterancePopover.vue';
import { useMediaStore } from '@/shared/media/stores/media';

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


export type ModeType = 'PREVIEW' | 'EDIT' | 'DISABLED'

const mode = ref<ModeType>('PREVIEW') 

function keyEnterPressed() {
    mediaStore.updateText(props.phrase, editText)
    updateSpeakerMode('PREVIEW')
}

function handleDeleteClick() {
    mediaStore.removeCue(props.phrase)
    updateSpeakerMode('PREVIEW')
}

function exitEditingMode(e: UtteranceData){
    console.log('EXIT EDIT MODE', e)
    mediaStore.updateText(props.phrase, e.text)
    mediaStore.updateStartTime(props.phrase, e.start)
    mediaStore.updateEndTime(props.phrase, e.end)
    mediaStore.updateLayout(props.phrase, e.layout)
    mediaStore.updateSpeaker(props.phrase, e.speaker)
    updateSpeakerMode('PREVIEW')
}

function enterEditMode() {
    console.log('entrou no mode de edição')
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

</style>