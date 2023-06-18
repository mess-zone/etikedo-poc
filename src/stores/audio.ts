import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'

export type transcriptionCue = {
    isActive: boolean,
    startTime: number,
    endTime: number,
    speaker: string,
    text: string,
    cue: VTTCue,
}

const selectedFileUrl = ref('')
const selectedTranscriptionFileUrl = ref('')

const media = ref<HTMLMediaElement>(null)
const isLoadedMetadata = ref(false)

const transcriptions = ref<transcriptionCue[]>([])

const wafesurferRegions = shallowRef(RegionsPlugin.create())
// const wafesurferRegions = ref(RegionsPlugin.create())

const isPlaying = ref(false)

const currentTime = ref(0)

const duration = ref(0)

export const useAudioStore = defineStore('audio', () => {

    function $reset() {
        selectedFileUrl.value = ''
        selectedTranscriptionFileUrl.value = ''

        media.value = null
        isLoadedMetadata.value = false
        
        transcriptions.value = []

        wafesurferRegions.value = RegionsPlugin.create()
    }

    

    function setMedia(videoMedia: HTMLMediaElement) {
        media.value = videoMedia

        media.value.addEventListener('loadedmetadata', (e: Event) => {
            console.log('loadedmetadata')
            isLoadedMetadata.value = true
            duration.value = media.value.duration
        }, { once: true })

        // media.value.textTracks.onchange = (event) => {
        //     console.log(`'${event.type}' event fired`);
        // };

        media.value.addEventListener('play', () => {
            isPlaying.value = true
        })
        // media.value.addEventListener('playing', () => {
        //     console.log('[PLAYING]')
        // })
        media.value.addEventListener('pause', () => {
            isPlaying.value = false
        })
        media.value.addEventListener('timeupdate', (e) => {
            currentTime.value = media.value.currentTime
        })
    }

    function getTextTracks(): TextTrack[] {
        return Object.values(media.value.textTracks)
    }

    function createEmptyTrack(trackId: string) {
        // @ts-ignore
        const track: HTMLTrackElement = media.value.addTextTrack("metadata", trackId, "pt-BR");
        
        media.value.textTracks.addEventListener("addtrack", (e) => {
            // console.log('added track', e.track)
            e.track.mode = 'hidden'
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
            e.track.mode = 'hidden'
            // media.value.textTracks[0].mode = "showing"; // thanks Firefox
            // loadTrack(trackId)
        }, { once: true });

        const track = document.createElement("track");
        // track.default = true
        track.kind = "metadata";
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
        transcriptions.value = Object.values(track.cues)
            .map(c => ({ 
                isActive: false, 
                startTime: c.startTime, 
                endTime: c.endTime, 
                speaker: 'adalberto',// TODO
                text: (c as VTTCue).text, // TODO
                cue: c as VTTCue }))

        for(const subtitle of transcriptions.value) {
            subtitle.cue.text = unescapeNewLine(subtitle.cue.text).trim()

            subtitle.cue.addEventListener("enter", (event) => {
                subtitle.isActive = true
            });
            subtitle.cue.addEventListener("exit", (event) => {
                subtitle.isActive = false
            });

            const waveRegion = wafesurferRegions.value.addRegion({
                id: subtitle.cue.id,
                start: subtitle.startTime,
                end: subtitle.endTime,
                // content: subtitleItem.value.cue.text,
            })

            waveRegion.on('update', () => {
                subtitle.startTime = waveRegion.start
                subtitle.cue.startTime = waveRegion.start
    
                subtitle.endTime = waveRegion.end
                subtitle.cue.endTime = waveRegion.end
    
                // precision adjust to region always be active
                goToTime(waveRegion.start + 0.1)

            })
        }
    }

    function exportTrack(trackId: string) {
        const track = getTextTracks().find(track => track.label == trackId)
        return Object.values(track.cues)
                    .map(c => c as VTTCue)
                    .map(c => ({ 
                        id: c.id, 
                        startTime: c.startTime, 
                        endTime: c.endTime, 
                        text: c.text, // TODO
                        speaker: 'adalberto',// TODO
                    }))
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

        const subtitleItem = ref<transcriptionCue>({
            isActive: false,
            startTime: start,
            endTime: end,
            speaker: 'adalberto', // TODO,
            text: text, // TODO
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

        const waveRegion = wafesurferRegions.value.addRegion({
            id: cue.id,
            start: start,
            end: end,
            // content: subtitleItem.value.cue.text,
        })

        waveRegion.on('update', () => {
            // console.log('region updated', waveRegion.start, waveRegion.end)
            subtitleItem.value.startTime = waveRegion.start
            subtitleItem.value.cue.startTime = waveRegion.start

            subtitleItem.value.endTime = waveRegion.end
            subtitleItem.value.cue.endTime = waveRegion.end

            // precision adjust to region always be active
            goToTime(waveRegion.start + 0.1)

            // if(subtitleItem.value.startTime >= getCurrentTime() && subtitleItem.value.endTime <= getCurrentTime()) {
            //     subtitleItem.value.isActive = true
            // } else {
            //     subtitleItem.value.isActive = false
            // }

        })

        transcriptions.value.push(subtitleItem.value)
        transcriptions.value.sort((a, b) => { 
            if(a.startTime < b.startTime) {
                // a is less than b
                return -1
            } else if(a.startTime > b.startTime) {
                // a is greater than b
                return 1
            } 
            // a must be equal to b
            return 0
        })

        track.addCue(cue);
        // console.log(track.activeCues)
    }

    function removeCue(subtitleCue: transcriptionCue) {
        const track = getTextTracks()[0]
        track.removeCue(subtitleCue.cue);
        // console.log('remove clue', track)

        const index = transcriptions.value.indexOf(subtitleCue);
        if (index > -1) {
            transcriptions.value.splice(index, 1);
        }

        wafesurferRegions.value.getRegions().find(r => r.id == subtitleCue.cue.id).remove()
        // console.log(wafesurferRegions.value.getRegions())
    }

    function updateStartTime(subtitleCue: transcriptionCue, newValue: number) {
        // const index = subtitles.value.indexOf(subtitleCue);
        // subtitles.value[index].cue.startTime = newValue
        subtitleCue.startTime = newValue
        subtitleCue.cue.startTime = newValue
        wafesurferRegions.value.getRegions().find(r => r.id == subtitleCue.cue.id).setOptions({
            start: newValue
        })
        
    }

    function updateEndTime(subtitleCue: transcriptionCue, newValue: number) {
        // const index = subtitles.value.indexOf(subtitleCue);
        // subtitles.value[index].cue.startTime = newValue
        subtitleCue.endTime = newValue
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
        subtitles: transcriptions,
        goToTime,
        addCue,
        getCurrentTime,
        removeCue,
        updateStartTime,
        updateEndTime,
        wafesurferRegions,
        isPlaying,
        currentTime,
        duration,
    }
    
})