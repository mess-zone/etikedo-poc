<template>
    <div>
        <h1>
            {{ configuration.project }} - {{ configuration.createdAt }}
            <router-link to="/">fechar</router-link> 
        </h1>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

interface ProjectConfig {
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

const route = useRoute()

const electronAPI = window.electronAPI

const configuration = ref<ProjectConfig>({
    project: '',
    createdAt: null,
    version: '',
    type: '',
    resource: '',
})

async function openConfigFile(fullPath: string) {
    console.log('OPEN CONFIG FILE', fullPath)
    const content = await electronAPI.readFile(fullPath)
    configuration.value = JSON.parse(content)
}

onMounted(async () => {
    const path = route.query.path.toString()
    await openConfigFile(path)
})
</script>