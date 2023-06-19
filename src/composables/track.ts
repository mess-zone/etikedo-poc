import { ref } from "vue"

export type IUtterance = {
    id: number,
    text: string,
    speaker: string,
    start: string,
    end: string,
    display: string,
}

export function useTrack() {

    const id = ref('track-id')

    return {
        id,
    }
}