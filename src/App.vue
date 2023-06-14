<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";

import { computed, onMounted, ref } from "vue";
import { FileInfo } from "./renderer";

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
  path.value =  fullPath
  files.value = await electronAPI.getFiles(fullPath)
}

const handleClick = async (item: FileInfo) => {
  console.log('clicked', item.path)
  if(item.directory) {
    await openFolder(item.path)
  }
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

<template>
    <h1>{{ path }}</h1><button @click="handleBackClick">back</button>
    <input type="text" v-model="searchString">
    <ul>
      <li v-for="item in filteredFiles" :key="item.path" @click="handleClick(item)">
        {{ 
          item 
        }}

      </li>
    </ul>
    <footer>
      We are using Node.js <span id="node-version">{{electronAPI['node']() }}</span>,
      Chromium <span id="chrome-version">{{electronAPI['chrome']() }}</span>,
      and Electron <span id="electron-version">{{electronAPI['electron']() }}</span>.
    </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
img {
  margin: 5px;
}
.plugins {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

li {
  border: 1px solid red;
  padding: 20px;
}
</style>
