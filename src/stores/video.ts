import { defineStore } from 'pinia'
import { ref } from 'vue'

export type subtitleCue = {
    isActive: boolean,
    cue: VTTCue,
}

const media = ref(null)
const isLoadedMetadata = ref(false)

const subtitles = ref<subtitleCue[]>([])

export const useVideoStore = defineStore('video', () => {

    function setMedia(videoMedia: HTMLMediaElement) {
        media.value = videoMedia

        media.value.addEventListener('loadedmetadata', (e: Event) => {
            console.log('loadedmetadata')
            isLoadedMetadata.value = true
        })
    }

    function getTextTracks(): TextTrack[] {
        return Object.values(media.value.textTracks)
    }

    function loadTrack(trackId: string) {
        console.log('load track ', trackId)
        const track = getTextTracks().find(track => track.id == trackId)
        subtitles.value = Object.values(track.cues).map(c => ({ isActive: false, cue: c as VTTCue }))

        for(const subtitle of subtitles.value) {
            subtitle.cue.addEventListener("enter", (event) => {
                subtitle.isActive = true
            });
            subtitle.cue.addEventListener("exit", (event) => {
                subtitle.isActive = false
            });
        }
    }

    function goToTime(seconds: number) {
        media.value.currentTime = seconds
    }

    return {
        media,
        setMedia,
        isLoadedMetadata,
        getTextTracks,
        loadTrack,
        subtitles,
        goToTime,
    }
    
})