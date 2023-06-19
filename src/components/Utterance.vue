<template>
    <span class="utterance" :class="[speakerModeIsEditing?'speaker-mode-editing':'', mode, phrase.display ]">
        {{ speakerModeIsEditing }}
        <contenteditable class="editable" tag="span" :contenteditable="mode == 'EDIT'" v-model="phrase.text" :no-nl="true" :no-html="true" @returned="keyEnterPressed(phrase)" />
        <div class="popover">
            <div class="popover-box">
                <button v-if="mode == 'EDIT'" @click="handleExitClick(phrase)">exit</button>
                <button v-else @click="handleEditClick(phrase)">edit</button>
                    {{ phrase.id }} <a href="#">{{ phrase.speaker }}</a> {{ phrase.start }}
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import { Ref, inject, ref } from 'vue';
import contenteditable from 'vue-contenteditable'
const emit = defineEmits(['mode:changed'])

export type IUtterance = {
    id: number,
    text: string,
    speaker: string,
    start: string,
    display: string,
}

const props = defineProps<{
    phrase: IUtterance,
}>()

const { speakerModeIsEditing, updateSpeakerMode } = inject<{ speakerModeIsEditing: Ref, updateSpeakerMode: (value: boolean) => void }>('speakerMode')

export type ModeType = 'PREVIEW' | 'EDIT' | 'DISABLED'

const mode = ref<ModeType>('PREVIEW') 

function keyEnterPressed(phase: IUtterance) {
    console.log('enter pressed')
    exitEditingMode(phase)
}

function handleExitClick(phase: IUtterance) {
    exitEditingMode(phase)
}

function handleEditClick(phase: IUtterance) {
    enterEditMode(phase)
}

function exitEditingMode(phase: IUtterance){
    mode.value = 'PREVIEW'
    updateSpeakerMode(false)
    emit('mode:changed', mode.value)
}

function enterEditMode(phase: IUtterance) {
    mode.value = 'EDIT'
    updateSpeakerMode(true)
    emit('mode:changed', mode.value)
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
    background-color: yellow !important;
}
.utterance.EDIT {
    background-color: rgb(255, 0, 43) !important;
}
.utterance.DISABLED {
    background-color: rgb(0, 195, 255) !important;
    pointer-events: none;
}

.utterance.display-inline {
    display: inline;
    margin-right: 0.25em;
}

.utterance.display-block {
    display: block;
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

.utterance.speaker-mode-editing:not(.EDIT) {
    pointer-events: none;
    background-color: rgb(0, 195, 255) !important;
}
.utterance.speaker-mode-editing:not(.EDIT) .editable {
    opacity: .5;
}

/* .utterance.EDIT .editable {
} */

.editable {
    /* background-color: pink; */
    line-height: 1.5em;
    /* outline-offset: 5px; */
    outline: none;
    border-bottom: 3px solid transparent;
}

.utterance:not(.EDIT):hover .editable {
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
}

.utterance.EDIT .popover,
.utterance:hover .popover {
    display: block;
}

</style>