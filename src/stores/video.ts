import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'

export type subtitleCue = {
    isActive: boolean,
    cue: VTTCue,
}

const selectedFileUrl = ref('')
const selectedTranscriptionFileUrl = ref('')

const media = ref(null)
const isLoadedMetadata = ref(false)

const subtitles = ref<subtitleCue[]>([])

const wafesurferRegions = shallowRef(RegionsPlugin.create())
// const wafesurferRegions = ref(RegionsPlugin.create())

export const useVideoStore = defineStore('video', () => {

    function $reset() {
        selectedFileUrl.value = ''
        selectedTranscriptionFileUrl.value = ''

        media.value = null
        isLoadedMetadata.value = false
        
        subtitles.value = []

        wafesurferRegions.value = RegionsPlugin.create()
    }

    function setMedia(videoMedia: HTMLMediaElement) {
        media.value = videoMedia

        media.value.addEventListener('loadedmetadata', (e: Event) => {
            // console.log('loadedmetadata')
            isLoadedMetadata.value = true
        }, { once: true })

        // media.value.textTracks.onchange = (event) => {
        //     console.log(`'${event.type}' event fired`);
        // };
    }

    function getTextTracks(): TextTrack[] {
        return Object.values(media.value.textTracks)
    }

    function createEmptyTrack(trackId: string) {
        const track: HTMLTrackElement = media.value.addTextTrack("subtitles", trackId, "pt-BR");
        
        media.value.textTracks.addEventListener("addtrack", (e) => {
            // console.log('added track', e.track)
            e.track.mode = 'showing'
            // media.value.textTracks[0].mode = "showing"; // thanks Firefox
            // loadTrack(trackId)
        }, { once: true });


        // track.addEventListener("load", function() {
        //     console.log('track loaded')
        //     // loadTrack(trackId)
        // });
    }

    function importTextTrack(trackId: string, path: string) {

        media.value.textTracks.addEventListener("addtrack", (e) => {
            // console.log('added track', e.track)
            e.track.mode = 'showing'
            // media.value.textTracks[0].mode = "showing"; // thanks Firefox
            // loadTrack(trackId)
        }, { once: true });

        const track = document.createElement("track");
        // track.default = true
        track.kind = "subtitles";
        // track.id = trackId
        track.label = trackId;
        track.srclang = "pt-BR";
        track.src = path
        track.addEventListener("load", function() {
            // console.log('track loaded')
            loadTrack(trackId)
            // // @ts-ignore
            // track.mode = "showing";
            // media.value.textTracks[0].mode = "showing"; // thanks Firefox
        }, { once: true });
        media.value.appendChild(track);
    }

    const unescapeNewLine = (str: string) => str.replace(/\\n/g, '\n')

    function loadTrack(trackId: string) {
        const track = getTextTracks().find(track => track.label == trackId)
        subtitles.value = Object.values(track.cues)
            .map(c => ({ isActive: false, cue: c as VTTCue }))

        for(const subtitle of subtitles.value) {
            subtitle.cue.text = unescapeNewLine(subtitle.cue.text).trim()

            subtitle.cue.addEventListener("enter", (event) => {
                subtitle.isActive = true
            });
            subtitle.cue.addEventListener("exit", (event) => {
                subtitle.isActive = false
            });
        }
    }

    function exportTrack(trackId: string) {
        const track = getTextTracks().find(track => track.label == trackId)
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
        cue.id = uuidv4();

        const subtitleItem = ref({
            isActive: false,
            cue: cue,
        })

        wafesurferRegions.value.addRegion({
            id: cue.id,
            start: start,
            end: end,
            // content: subtitleItem.value.cue.text,
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

        wafesurferRegions.value.getRegions().find(r => r.id == subtitleCue.cue.id).remove()
        // console.log(wafesurferRegions.value.getRegions())
    }

    function updateStartTime(subtitleCue: subtitleCue, newValue: number) {
        // const index = subtitles.value.indexOf(subtitleCue);
        // subtitles.value[index].cue.startTime = newValue
        subtitleCue.cue.startTime = newValue
        wafesurferRegions.value.getRegions().find(r => r.id == subtitleCue.cue.id).setOptions({
            start: newValue
        })
        
    }

    function updateEndTime(subtitleCue: subtitleCue, newValue: number) {
        // const index = subtitles.value.indexOf(subtitleCue);
        // subtitles.value[index].cue.startTime = newValue
        subtitleCue.cue.endTime = newValue
        wafesurferRegions.value.getRegions().find(r => r.id == subtitleCue.cue.id).setOptions({
            end: newValue
        })
    }

    return {
        $reset,
        selectedFileUrl,
        selectedTranscriptionFileUrl,
        media,
        setMedia,
        isLoadedMetadata,
        getTextTracks,
        createEmptyTrack,
        importTextTrack,
        loadTrack,
        exportTrack,
        subtitles,
        goToTime,
        addCue,
        getCurrentTime,
        removeCue,
        updateStartTime,
        updateEndTime,
        wafesurferRegions,
    }
    
})