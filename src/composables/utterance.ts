import { Ref, readonly, ref, toValue, watch } from "vue"
import { v4 as uuidv4 } from 'uuid';

export type LayoutType = 'BLOCK' | 'INLINE'

// TODO rename to speech, utterance, expression, phrase, statement
export interface UtteranceData {
    id: string,
    text: string,
    start: number,
    end: number,
    speaker?: number,
    layout?: LayoutType,
}

export interface InUtterance {
    id: Ref<string>,
    text: Ref<string>,
    start: Ref<number>,
    end: Ref<number>,
    speaker?: Ref<number>,
    layout?: Ref<LayoutType>,
    create(_text: string, _start?: number, _end?: number, _speaker?: number, _layout?: LayoutType): void,
    hydrate(_id: string, _text: string, _start?: number, _end?: number, _speaker?: number, _layout?: LayoutType): void,
    updateText(value: string | Ref<string>): void,
}

export function useUtterance(): Readonly<InUtterance> {

    const id = ref(uuidv4())
    const text = ref('')
    const start = ref(0)
    const end = ref(0)
    const speaker = ref(0)
    const layout = ref<LayoutType>('BLOCK')

    function create(_text: string, _start = 0, _end = 0, _speaker = 0, _layout: LayoutType = 'BLOCK') {
        // id.value = uuidv4()
        text.value = _text
        start.value = _start
        end.value = _end
        speaker.value = _speaker
        layout.value = _layout
    }

    function hydrate(_id: string, _text: string, _start = 0, _end = 0, _speaker = 0, _layout: LayoutType = 'BLOCK') {
        id.value = _id
        text.value = _text
        start.value = _start
        end.value = _end
        speaker.value = _speaker
        layout.value = _layout
    }

    function updateText(value: string | Ref<string>) {
        console.log('update text', value)
        text.value = toValue(value)
    }

    watch(text, (value) => {
        console.log(`event text changed: ${value}`)
    })

    return readonly({
        id,
        text,
        start,
        end,
        speaker,
        layout,
        create,
        hydrate,
        updateText,
    })
}