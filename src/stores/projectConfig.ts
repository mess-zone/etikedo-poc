import { defineStore } from "pinia";
import { ref } from "vue";

export interface ProjectConfig {
    project: string,
    createdAt: Date,
    version: string,
    type: string,
    resource: string,
    transcription?: {
        json?: string,
        vtt?: string,
    }
}

const configuration = ref<ProjectConfig>({
    project: '',
    createdAt: null,
    version: '',
    type: '',
    resource: '',
})

const folderPath = ref<string>()

export const useProjectConfig = defineStore('projectConfig', () => {
    function $reset() {
        configuration.value = {
            project: '',
            createdAt: null,
            version: '',
            type: '',
            resource: '',
            transcription: null,
        }
    }

    // TODO config should came with absolute paths pre configured
    function setConfig(fullPath: string, config: ProjectConfig) {
        folderPath.value = fullPath.replace('config.etikedo.json', '')

        configuration.value = {
            project: config.project,
            createdAt: config.createdAt,
            version: config.version,
            type: config.type,
            resource: folderPath.value + config.resource,
            transcription: {
                json: config.transcription.json ? folderPath.value + config.transcription.json : undefined,
                vtt: config.transcription.vtt ? folderPath.value + config.transcription.vtt : undefined,
            }
        }
    }

    return {
        $reset,
        setConfig,
        configuration,
        folderPath,
    }

})