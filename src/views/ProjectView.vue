<template>
    <component :is="projectLayoutComponent[currentLayout]"></component>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaStore } from '../stores/media';
import { storeToRefs } from 'pinia';
import VideoLayout from '../components/VideoLayout.vue'
import AudioLayout from '../components/AudioLayout.vue'

import { useProjectConfig } from '../stores/projectConfig';

const route = useRoute()

// @ts-ignore
const electronAPI = window.electronAPI

const projectConfig = useProjectConfig()
const { configuration } = storeToRefs(projectConfig)

const projectLayoutComponent = {
    VideoLayout,
    AudioLayout,
}

type LayoutType = 'VideoLayout' | 'AudioLayout'

const currentLayout = ref<LayoutType>('VideoLayout')

async function openConfigFile(fullPath: string) {
    console.log('OPEN CONFIG FILE', fullPath)
    // TODO readConfigFile should return a json with absolute paths configured
    const content = await electronAPI.readFile(fullPath)
    projectConfig.setConfig(fullPath, JSON.parse(content))
    currentLayout.value = configuration.value.type as LayoutType
}

const mediaStore = useMediaStore()

onMounted(async () => {
    const path = route.query.path.toString()
    await openConfigFile(path)
    mediaStore.selectedFileUrl = configuration.value.resource
})
</script>
