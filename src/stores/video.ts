import { defineStore } from 'pinia'
import { ref } from 'vue'

export type subtitleCue = {
    isActive: boolean,
    cue: VTTCue,
}

const selectedFileUrl = ref('')

const media = ref(null)
const isLoadedMetadata = ref(false)

const subtitles = ref<subtitleCue[]>([])

export const useVideoStore = defineStore('video', () => {

    function setMedia(videoMedia: HTMLMediaElement) {
        media.value = videoMedia

        media.value.addEventListener('loadedmetadata', (e: Event) => {
            // console.log('loadedmetadata')
            isLoadedMetadata.value = true
        })

        // media.value.textTracks.onchange = (event) => {
        //     console.log(`'${event.type}' event fired`);
        // };
    }

    function getTextTracks(): TextTrack[] {
        return Object.values(media.value.textTracks)
    }

    function loadTrack(trackId: string) {
        // console.log('load track ', trackId)
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

    function exportTrack(trackId: string) {
        const track = getTextTracks().find(track => track.id == trackId)
        return Object.values(track.cues)
                    .map(c => c as VTTCue)
                    .map(c => ({ id: c.id, startTime: c.startTime, endTime: c.endTime, text: c.text }))
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
            // console.log('cue enter')
            subtitleItem.value.isActive = true
        });
        cue.addEventListener("exit", (event) => {
            // console.log('cue exit')
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
        // console.log(track.activeCues)
    }

    function removeCue(subtitleCue: subtitleCue) {
        const track = getTextTracks()[0]
        track.removeCue(subtitleCue.cue);
        // console.log('remove clue', track)

        const index = subtitles.value.indexOf(subtitleCue);
        if (index > -1) {
            subtitles.value.splice(index, 1);
        }
    }

    function updateStartTime(subtitleCue: subtitleCue, newValue: number) {
        // const index = subtitles.value.indexOf(subtitleCue);
        // subtitles.value[index].cue.startTime = newValue
        subtitleCue.cue.startTime = newValue
    }

    function updateEndTime(subtitleCue: subtitleCue, newValue: number) {
        // const index = subtitles.value.indexOf(subtitleCue);
        // subtitles.value[index].cue.startTime = newValue
        subtitleCue.cue.endTime = newValue
    }

    return {
        selectedFileUrl,
        media,
        setMedia,
        isLoadedMetadata,
        getTextTracks,
        loadTrack,
        exportTrack,
        subtitles,
        goToTime,
        addCue,
        getCurrentTime,
        removeCue,
        updateStartTime,
        updateEndTime,
    }
    
})