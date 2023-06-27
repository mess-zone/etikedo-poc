import { TranscriptionCue } from "@/shared/media/composables/track";
import { defineStore } from "pinia";
import { MaybeRefOrGetter, ref, toRef, toValue } from "vue";

export type ModeType = 'PREVIEW' | 'EDIT' | 'DISABLED'

const editMode = ref('PREVIEW')
const selectedUtterance = ref<HTMLElement>(null)
const selectedUtteranceCue = ref<TranscriptionCue>(null)

export const useSelectedUtteranceStore = defineStore('selectedUtterance', () => {

    function select(cue: MaybeRefOrGetter<TranscriptionCue> ,el: MaybeRefOrGetter<HTMLElement>) {
        selectedUtterance.value = toValue(el)
        selectedUtteranceCue.value = toValue(cue)
    }

    function unselect() {
        selectedUtterance.value = null
        selectedUtteranceCue.value = null
        setEditMode('PREVIEW')
    }

    function setEditMode(mode: MaybeRefOrGetter<ModeType>) {
        editMode.value = toValue(mode)
    }

    return {
        editMode,
        setEditMode,
        selectedUtterance,
        selectedUtteranceCue,
        select,
        unselect,
    }
})