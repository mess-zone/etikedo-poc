import { TranscriptionCue } from "@/shared/media/composables/track";
import { defineStore } from "pinia";
import { MaybeRefOrGetter, computed, ref, toRef, toValue } from "vue";

export type ModeType = 'PREVIEW' | 'EDIT' | 'DISABLED'


export const useSelectedUtteranceStore = defineStore('selectedUtterance', () => {

    const editMode = ref('PREVIEW')
    const selectedUtteranceEl = ref<HTMLElement>(null)
    const selectedUtteranceCue = ref<TranscriptionCue>(null)

    const top = computed(() => {
        return (selectedUtteranceEl.value?.offsetTop || 0)
        // return (selectedUtteranceEl.value?.getBoundingClientRect().top || 0)
    })
    
    const left = computed(() => {
        return (selectedUtteranceEl.value?.getBoundingClientRect().left || 0)
    })
    
    function select(cue: MaybeRefOrGetter<TranscriptionCue>, el: MaybeRefOrGetter<HTMLElement>) {
        selectedUtteranceEl.value = toValue(el)
        selectedUtteranceCue.value = toValue(cue)
    }

    function unselect() {
        selectedUtteranceEl.value = null
        selectedUtteranceCue.value = null
        setEditMode('PREVIEW')
    }

    function setEditMode(mode: MaybeRefOrGetter<ModeType>) {
        editMode.value = toValue(mode)
    }

    return {
        editMode,
        setEditMode,
        selectedUtteranceEl,
        selectedUtteranceCue,
        top,
        left,
        select,
        unselect,
    }
})