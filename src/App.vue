<template>
  <router-view></router-view>
  <footer>
    We are using Node.js <span id="node-version">{{electronAPI['node']() }}</span>,
    Chromium <span id="chrome-version">{{electronAPI['chrome']() }}</span>,
    and Electron <span id="electron-version">{{electronAPI['electron']() }}</span>.
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const electronAPI = window.electronAPI

async function sendPing() {
  const response = await electronAPI.ping()
  console.log(response)
}

onMounted(async () => {
  await sendPing()
}) 

</script>

<style>

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
}

footer {
  font-size: .8em;
  padding: 10px;
  text-align: right;
}

</style>
