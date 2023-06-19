<template>
    <span class="utterance" :class="[phrase.isEditable ? 'is-editing':'', phrase.display ]">
        <contenteditable class="editable" tag="span" :contenteditable="phrase.isEditable" v-model="phrase.text" :no-nl="true" :no-html="true" @returned="enterPressed(phrase)" />
        <div class="popover">
            <div class="popover-box">
                <button v-if="phrase.isEditable" @click="handleExitClick(phrase)">exit</button>
                <button v-else @click="handleEditClick(phrase)">edit</button>
                    {{ phrase.id }} <a href="#">{{ phrase.speaker }}</a> {{ phrase.start }}
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import contenteditable from 'vue-contenteditable'

export type IUtterance = {
    id: number,
    text: string,
    speaker: string,
    isEditable: boolean,
    start: string,
    display: string,
}

const props = defineProps<{
    phrase: IUtterance
}>()

// const phrase = ref<Phase>({
//         id: 0,
//         text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non?",
//         speaker: 'Lucas',
//         isEditable: false,
//         start: '00:45:89',
//         display: 'display-block',
// })

function enterPressed(phase: IUtterance) {
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
  console.log('exit editing mode');
  phase.isEditable = false
}

function enterEditMode(phase: IUtterance) {
    console.log('click', phase)
    phase.isEditable = true
}

</script>

<style scoped>

.utterance {
    position: relative;
    /* border: 1px solid red; */
    min-height: 1.5em;
    min-width: 52px;
}

.utterance.display-inline {
    display: inline;
    margin-right: 0.25em;
}

.utterance.display-block {
    display: block;
    margin-bottom: 1em;
}

.utterance.is-editing {
    outline: 2px solid rgb(137, 43, 226);
    outline-offset: 0.25em;
    border-radius: 0.25em;
}

.utterance.is-editing:has(.editable:focus) {
    /* background-color: green; */
    /* box-shadow: 0px 0 6px 4px rgb(14 223 0); */
    outline-color: rgb(226, 177, 43);
}

/* .utterance.is-editing .editable {
} */

.editable {
    /* background-color: pink; */
    line-height: 1.5em;
    /* outline-offset: 5px; */
    outline: none;
    border-bottom: 3px solid transparent;
}

.utterance:not(.is-editing):hover .editable {
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

.utterance.is-editing .popover,
.utterance:hover .popover {
    display: block;
}

</style>