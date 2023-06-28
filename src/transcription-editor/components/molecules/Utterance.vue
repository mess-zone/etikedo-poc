<template>
    <span ref="utteranceRef" class="utterance" :class="[ mode, phrase.data.layout, phrase.isActive ? 'is-active' : '' ]" @click="handleUtteranceClick">
        <contenteditable class="editable" tag="span" :contenteditable="mode == 'EDIT'" v-model="editText" :no-nl="true" :no-html="true" @returned="keyEnterPressed" />
    </span>
</template>
<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import contenteditable from 'vue-contenteditable'
import { TranscriptionCue } from '@/shared/media/composables/track';
import { useMediaStore } from '@/shared/media/stores/media';
import { ModeType, useSelectedUtteranceStore } from '@/transcription-editor/stores/selectedUtterance';
import { storeToRefs } from 'pinia';

const mediaStore = useMediaStore()

const selectedUtteranceStore = useSelectedUtteranceStore()
const { editMode, selectedUtteranceCue } = storeToRefs(selectedUtteranceStore)

const props = defineProps<{
    phrase: TranscriptionCue,
}>()

const utteranceRef = ref(null)

const { phrase } = toRefs(props) // ref 'text' is synced with 'props'

const editText = ref(phrase.value.data.text)

watch(props.phrase, (value) => {
    editText.value = phrase.value.data.text
})

watch(editMode, () => {
    if(editMode.value == 'EDIT') {
        if(selectedUtteranceCue.value.id == props.phrase.id) {
            mode.value = editMode.value as ModeType
        } else {
            mode.value = 'DISABLED'
        }
    } else {
        mode.value = 'PREVIEW'
    }
})

const mode = ref<ModeType>('PREVIEW') 

function keyEnterPressed() {
    mediaStore.updateText(props.phrase, editText)
    selectedUtteranceStore.unselect()
}

function handleUtteranceClick() {
    selectedUtteranceStore.select(phrase, utteranceRef)
    console.log('utterance click', utteranceRef.value.getBoundingClientRect())
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