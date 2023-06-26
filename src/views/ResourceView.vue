<template>
    <div>
        resource view
        <router-link :to="{ name: 'TranscriptionEditor', query: { path: route.query.path.toString() }  }">editar transcrição</router-link> 

        <button @click="() => { $router.go(-1) }">fechar</button>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaStore } from '../stores/media';
import { storeToRefs } from 'pinia';

import { useProjectConfig } from '../stores/projectConfig';

const route = useRoute()

// @ts-ignore
const electronAPI = window.electronAPI

const projectConfig = useProjectConfig()
const { configuration } = storeToRefs(projectConfig)



async function openConfigFile(fullPath: string) {
    console.log('OPEN CONFIG FILE', fullPath)
    // TODO readConfigFile should return a json with absolute paths configured
    const content = await electronAPI.readFile(fullPath)
    projectConfig.setConfig(fullPath, JSON.parse(content))
    console.log(content)
}

const mediaStore = useMediaStore()

onMounted(async () => {
    const path = route.query.path.toString()
    await openConfigFile(path)
    mediaStore.selectedFileUrl = configuration.value.resource
})
</script>
