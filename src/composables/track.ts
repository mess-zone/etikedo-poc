import { MaybeRefOrGetter, Ref, ref, toValue } from "vue"
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

export function useTrack() {

    const id = ref('track-id')

    const utterances = ref<UtteranceData[]>([])
    
    addUtterance(sample[0])
    addUtterance(sample[1])
    addUtterance(sample[2])
    addUtterance(sample[3])
    addUtterance(sample[4])
    addUtterance(sample[5])

    function addUtterance(item: MaybeRefOrGetter<UtteranceData>) {
        const { text, start, end, speaker, layout } = toValue(item)

        const utterance = {
            id: uuidv4(),
            text, 
            start, 
            end, 
            speaker, 
            layout,
        }
        utterances.value.push(utterance)
    }

    function removeUtterance(item: MaybeRefOrGetter<UtteranceData>) {
        const index = utterances.value.indexOf(toValue(item));
        if (index > -1) {
            utterances.value.splice(index, 1);
        }
    }

    function updateUtteranceText(id: MaybeRefOrGetter<string>, text: MaybeRefOrGetter<string>) {
        const searchId = toValue(id)
        const utterance = utterances.value.find(u => u.id == searchId)
        utterance.text = toValue(text)
    }

    return {
        id,
        utterances,
        addUtterance,
        removeUtterance,
        updateUtteranceText,
    }
}