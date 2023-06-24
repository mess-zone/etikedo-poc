import { defineStore } from 'pinia'
import { MaybeRefOrGetter, ref, shallowRef, toValue } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { LayoutType, UtteranceData, useTrack } from '../composables/track';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'
import { TranscriptionCue } from '../composables/track'

// export type transcriptionCue = {
//     id: string,
//     isActive: boolean,
//     cue: VTTCue,
//     data: UtteranceData,
//     // TODO wavesurferegion
// }

const selectedFileUrl = ref('')
const selectedTranscriptionFileUrl = ref('')

const media = ref<HTMLMediaElement>(null)
const isLoadedMetadata = ref(false)

// const transcriptions = ref<TranscriptionCue[]>([])

const wavesurferRegions = shallowRef(RegionsPlugin.create())

const isPlaying = ref(false)

const currentTime = ref(0)

const duration = ref(0)

const loadedTrack = useTrack('transcription')

export const useAudioStore = defineStore('audio', () => {

    function $reset() {
        selectedFileUrl.value = ''
        selectedTranscriptionFileUrl.value = ''

        media.value = null
        isLoadedMetadata.value = false

        // TODO reset loaded track
        // loadedTrack.value.reset()
        wavesurferRegions.value = RegionsPlugin.create()
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

    function getHTMLTextTracksElements(): TextTrack[] {
        return Object.values(media.value.textTracks)
    }

    // function getTrack(id: string) {
    //     return loadedTracks.value.find(t => t.id == id)
    // }

    function createEmptyTrack() {
        // loadedTracks.value.push(useTrack(trackId))
        
        const id = 'transcription'
        // @ts-ignore
        const track: HTMLTrackElement = media.value.addTextTrack("metadata", id, "pt-BR");
        
        media.value.textTracks.addEventListener("addtrack", (e) => {
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
        const track = getHTMLTextTracksElements().find(track => track.label == trackId)
        console.error('TODO...')
        // transcriptions.value = Object.values(track.cues)
        //     .map(rawCue => ({
        //         metadata: JSON.parse((rawCue as VTTCue).text),
        //         cueObject: rawCue as VTTCue
        //     }))
        //     .map(c => ({ 
        //         id: c.cueObject.id,
        //         isActive: false, 
        //         startTime: c.cueObject.startTime, 
        //         endTime: c.cueObject.endTime, 
        //         speaker: ''+c.metadata.speaker,
        //         text: unescapeNewLine(c.metadata.text).trim(),
        //         cue: c.cueObject,
        //     }))

        // for(const subtitle of transcriptions.value) {
        //     // subtitle.cue.text = subtitle.cue.text

        //     subtitle.cue.addEventListener("enter", (event) => {
        //         subtitle.isActive = true
        //     });
        //     subtitle.cue.addEventListener("exit", (event) => {
        //         subtitle.isActive = false
        //     });

        //     const waveRegion = wafesurferRegions.value.addRegion({
        //         id: subtitle.cue.id,
        //         start: subtitle.startTime,
        //         end: subtitle.endTime,
        //         // content: subtitleItem.value.cue.text,
        //     })

        //     waveRegion.on('update', () => {
        //         subtitle.startTime = waveRegion.start
        //         subtitle.cue.startTime = waveRegion.start
    
        //         subtitle.endTime = waveRegion.end
        //         subtitle.cue.endTime = waveRegion.end
    
        //         // precision adjust to region always be active
        //         goToTime(waveRegion.start + 0.1)

        //     })
        // }
    }

    function formatDuration(durationInSeconds: number): string {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const milliseconds = Math.floor((durationInSeconds % 1) * 1000);
      
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
      
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
    }
    
    const escapeNewLines = (str: string) => {
        return str.replace(/\n/g, "\\n")
    }

    function asWebVTT(data: any[]) {
        let content = 'WEBVTT'

        content += data.map((cue: any) => 
            `\n\n${cue.id}` +
            `\n${formatDuration(cue.startTime)} --> ${formatDuration(cue.endTime)}` +
            `\n${JSON.stringify(cue.metadata)}` 
        ).join('')

        return content
    }

    function exportTrack() {
        console.error('TODO...')
        // const cues = transcriptions.value.map((t => ({
        //     id: t.id, 
        //     startTime: t.startTime, 
        //     endTime: t.endTime, 
        //     metadata: {
        //         speaker: +t.speaker,
        //         text: escapeNewLines(t.text),
        //     },
        // }))).sort((a: any, b: any) => { 
        //     if(a.startTime < b.startTime) {
        //         // a is less than b
        //         return -1
        //     } else if(a.startTime > b.startTime) {
        //         // a is greater than b
        //         return 1
        //     } 
        //     // a must be equal to b
        //     return 0
        // })

        // return asWebVTT(cues)

    }

    function getCurrentTime() {
        return media.value.currentTime
    }

    function goToTime(seconds: number) {
        media.value.currentTime = seconds
    }

    function addCue(text: string, start: number, end: number) {
       const utterance: TranscriptionCue =  loadedTrack.value.addUtterance({
            id: null,
            text,
            start,
            end,
            speaker: 0,
            layout: 'INLINE',
        })

        const track = getHTMLTextTracksElements()[0]
        track.addCue(utterance.cue);

        const waveRegion = wavesurferRegions.value.addRegion({
            id: utterance.id,
            start: start,
            end: end,
            // content: subtitleItem.value.cue.text,
        })

        waveRegion.on('update', () => {
            // console.log('region updated', waveRegion.id, waveRegion.start, waveRegion.end)
            loadedTrack.value.updateUtteranceStart(waveRegion.id, waveRegion.start)
            // utterance.data.start = waveRegion.start
            utterance.cue.startTime = waveRegion.start

            loadedTrack.value.updateUtteranceEnd(waveRegion.id, waveRegion.end)
            // utterance.data.end = waveRegion.end
            utterance.cue.endTime = waveRegion.end

            // precision adjust to region always be active
            goToTime(waveRegion.start + 0.1)
        })
    }

    function removeCue(subtitleCue: TranscriptionCue) {
        loadedTrack.value.removeUtterance(subtitleCue)

        const track = getHTMLTextTracksElements()[0]
        track.removeCue(subtitleCue.cue);

        wavesurferRegions.value.getRegions().find(r => r.id == subtitleCue.id).remove()
    }

    function updateText(subtitleCue: TranscriptionCue, text: MaybeRefOrGetter<string>) {
        loadedTrack.value.updateUtteranceText(subtitleCue.id, text)
    }

    function updateStartTime(subtitleCue: TranscriptionCue, newValue: MaybeRefOrGetter<number>) {
        const value = toValue(newValue)
        loadedTrack.value.updateUtteranceStart(subtitleCue.id, value)
        
        subtitleCue.cue.startTime = value
        wavesurferRegions.value.getRegions().find(r => r.id == subtitleCue.id).setOptions({
            start: value
        })
        
    }

    function updateEndTime(subtitleCue: TranscriptionCue, newValue: MaybeRefOrGetter<number>) {
        const value = toValue(newValue)
        loadedTrack.value.updateUtteranceEnd(subtitleCue.id, value)
        
        subtitleCue.cue.endTime = value
        wavesurferRegions.value.getRegions().find(r => r.id == subtitleCue.id).setOptions({
            end: value
        })
    }

    function updateLayout(subtitleCue: TranscriptionCue, newValue: MaybeRefOrGetter<LayoutType>) {
        loadedTrack.value.updateUtteranceLayout(subtitleCue.id, newValue)
    }

    function updateSpeaker(subtitleCue: TranscriptionCue, newValue: MaybeRefOrGetter<number>) {
        loadedTrack.value.updateUtteranceSpeaker(subtitleCue.id, newValue)
    }

    return {
        loadedTrack,
        $reset,
        selectedFileUrl,
        selectedTranscriptionFileUrl,
        media,
        setMedia,
        isLoadedMetadata,
        getHTMLTextTracksElements,
        createEmptyTrack,
        importTextTrack,
        loadTrack,
        exportTrack,
        // transcriptions,
        goToTime,
        getCurrentTime,
        addCue,
        removeCue,
        updateText,
        updateStartTime,
        updateEndTime,
        updateLayout,
        updateSpeaker,
        wavesurferRegions,
        isPlaying,
        currentTime,
        duration,
    }
    
})