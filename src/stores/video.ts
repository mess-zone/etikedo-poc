import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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

    function getCurrentTime() {
        return media.value.currentTime
    }

    function goToTime(seconds: number) {
        media.value.currentTime = seconds
    }

    function addCue(text: string, start: number, end: number) {
        const track = getTextTracks()[0]
        const cue = new VTTCue(start, end, text)
        cue.id = ''+ Math.random()

        const subtitleItem = ref({
            isActive: false,
            cue: cue,
        })

        cue.addEventListener("enter", (event) => {
            console.log('cue enter')
            subtitleItem.value.isActive = true
        });
        cue.addEventListener("exit", (event) => {
            console.log('cue exit')
            subtitleItem.value.isActive = false
        });

        subtitles.value.push(subtitleItem.value)
        subtitles.value.sort((a, b) => { 
            if(a.cue.startTime < b.cue.startTime) {
                // a is less than b
                return -1
            } else if(a.cue.startTime > b.cue.startTime) {
                // a is greater than b
                return 1
            } 
            // a must be equal to b
            return 0
        })

        track.addCue(cue);
        console.log(track.activeCues)
    }

    return {
        media,
        setMedia,
        isLoadedMetadata,
        getTextTracks,
        loadTrack,
        subtitles,
        goToTime,
        addCue,
        getCurrentTime,
    }
    
})