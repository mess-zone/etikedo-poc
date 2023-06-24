import { MaybeRefOrGetter, computed, markRaw, reactive, ref, toRef, toValue } from "vue"
import { v4 as uuidv4 } from 'uuid';

export type LayoutType = 'BLOCK' | 'INLINE'

// TODO rename to speech, utterance, expression, phrase, or statement?
export interface UtteranceData {
    id: string,
    text: string,
    start: number,
    end: number,
    speaker?: number,
    layout?: LayoutType,
}

export type TranscriptionCue = {
    id: string,
    isActive: boolean,
    data: UtteranceData,
    cue: VTTCue,
}

const sample: UtteranceData[] = [
    {
        id: '0',
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non?",
        speaker: 0,
        start: 2,
        end: 3.5,
        layout: 'BLOCK',
    },
    {
        id: '1',
        text: "Deu certo mesmo?",
        speaker: 1,
        start: 4,
        end: 9,
        layout: 'BLOCK',
    },
    {
        id: '2',
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorem, autem voluptas error eaque neque! Ipsam, deserunt officiis fugiat laborum enim libero corrupti id, optio iste accusantium odit natus non?",
        speaker: 2,
        start: 6,
        end: 8.5,
        layout: 'BLOCK',
    },
    {
        id: '3',
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        speaker: 2,
        start: 6.9,
        end: 8,
        layout: 'INLINE',
    },
    {
        id: '4',
        text: "ed dolorem,",
        speaker: 0,
        start: 8,
        end: 9,
        layout: 'INLINE',
    },
    {
        id: '5',
        text: "autem voluptas error eaque neque",
        speaker: 2,
        start: 8,
        end: 9,
        layout: 'INLINE',
    },
]

export function useTrack(trackId: string) {

    const id = ref(trackId)

    const utterances = ref<TranscriptionCue[]>([])

    const sortedUtterances = computed(() => {
        return utterances.value.sort((a, b) => { 
            if(a.data.start < b.data.start) {
                // a is less than b
                return -1
            } else if(a.data.start > b.data.start) {
                // a is greater than b
                return 1
            } 
            // a must be equal to b
            return 0
        })
    })

    const diarizedUtterances = computed(() => {
        const posts = sortedUtterances.value.reduce((speaker: TranscriptionCue[][], utterance: TranscriptionCue) => {
            if (speaker.length === 0) 
                speaker.unshift([utterance]);
            else if (speaker[0][0].data.speaker === utterance.data.speaker)
                speaker[0].push(utterance);
            else
                speaker.unshift([utterance]);
            return speaker;
        }, []);
        return posts.reverse();
    })

    function addUtterance(item: MaybeRefOrGetter<UtteranceData>) {
        const { text, start, end, speaker, layout } = toValue(item)

        const id =  uuidv4()
        const data = {
            id,
            text, 
            start, 
            end, 
            speaker, 
            layout,
        }
        const utterance = reactive({
            id,
            isActive: false,
            data,
            cue: markRaw(new VTTCue(start, end, JSON.stringify(data)))
        })

        utterance.cue.addEventListener("enter", (event) => {
            utterance.isActive = true
        });
        utterance.cue.addEventListener("exit", (event) => {
            utterance.isActive = false
        });

        utterances.value.push(utterance)

        


        return utterance
    }

    const unescapeNewLine = (str: string) => str.replace(/\\n/g, '\n')

    function importCue(cue: VTTCue) {
        const id = cue.id
        const metadata = JSON.parse(cue.text)

        const data: UtteranceData = {
            id,
            text: unescapeNewLine(metadata.text),
            start: cue.startTime, 
            end: cue.endTime, 
            speaker: metadata.speaker, 
            layout: metadata.layout,
        }
        const utterance = reactive({
            id,
            isActive: false,
            data,
            cue: markRaw(cue)
        })

        utterance.cue.addEventListener("enter", (event) => {
            utterance.isActive = true
        });
        utterance.cue.addEventListener("exit", (event) => {
            utterance.isActive = false
        });

        utterances.value.push(utterance)

        return utterance
    }

    function removeUtterance(item: TranscriptionCue) {
        const index = utterances.value.indexOf(item);
        if (index > -1) {
            utterances.value.splice(index, 1);
        }
    }

    function updateUtteranceText(id: MaybeRefOrGetter<string>, text: MaybeRefOrGetter<string>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        utterance.data.text = toValue(text)
    }

    function getUtterance(id: MaybeRefOrGetter<string>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        return toRef(utterance)
    }

    function updateUtteranceStart(id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<number>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        const value = toValue(newValue)
        utterance.data.start = value
    }

    function updateUtteranceEnd(id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<number>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        const value = toValue(newValue)
        utterance.data.end = value
    }

    function updateUtteranceLayout(id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<LayoutType>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        const value = toValue(newValue)
        utterance.data.layout = value
    }

    function updateUtteranceSpeaker(id: MaybeRefOrGetter<string>, newValue: MaybeRefOrGetter<number>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        const value = toValue(newValue)
        utterance.data.speaker = value
    }

    function splitUtterance() {
        // TODO
    }

    function mergeUtterances() {
        // TODO
    }

    return ref({
        id,
        sortedUtterances,
        diarizedUtterances,
        importCue,
        addUtterance,
        removeUtterance,
        getUtterance,
        updateUtteranceText,
        updateUtteranceStart,
        updateUtteranceEnd,
        updateUtteranceLayout,
        updateUtteranceSpeaker,
    })
}