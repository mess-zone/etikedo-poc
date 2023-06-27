<template>
    <div>
        <h1>File explorer view</h1>
        <h2>{{ path }}</h2>
        <input type="text" v-model="searchString" class="searchInput" placeholder="search on this folder...">
        <FilesViewer
            :files="filteredFiles"
            @back="handleBackClick"
            @folderclick="openFolder($event.path)"
        ></FilesViewer>
        <footer>
          We are using Node.js <span id="node-version">{{electronAPI['node']() }}</span>,
          Chromium <span id="chrome-version">{{electronAPI['chrome']() }}</span>,
          and Electron <span id="electron-version">{{electronAPI['electron']() }}</span>.
        </footer>
    </div>
</template>
<script setup lang="ts">
import FilesViewer from "@/file-explorer/components/FilesViewer.vue";
import { computed, onMounted, ref } from "vue";
import { FileInfo } from "@/renderer";

const path = ref('')
const files = ref<FileInfo[]>([])

const searchString = ref('')
const filteredFiles = computed(() => {
  return searchString.value 
    ? files.value.filter(s => s.name.startsWith(searchString.value)) 
    : files.value
})

const electronAPI = window.electronAPI

async function sendPing() {
  const response = await electronAPI.ping()
  console.log(response)
}

async function getRootPath() {
  const response = await electronAPI.getRootPath()
  return response
}

async function openFolder(fullPath: string) {
  console.log('OPEN FOLDER', fullPath)
  path.value =  fullPath
  files.value = await electronAPI.getFiles(fullPath)
}

const handleBackClick = async () => {
  const backPath = await electronAPI.getBackPath(path.value)
  console.log('backPath', backPath)
  await openFolder(backPath)
}

onMounted(async () => {
  await sendPing()
  const rootPath = await getRootPath()
  await openFolder(rootPath) 
}) 

</script>

<style  scoped>

h1 {
  margin: 0;
}
.searchInput {
  width: 100%;
  padding: 15px 10px;
  font-family: sans-serif;
  font-size: 1em;
}

footer {
  font-size: .8em;
  padding: 10px;
  text-align: right;
}

</style>