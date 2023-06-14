<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";

import fs from 'fs'
import pathModule from 'path'
import { onMounted, ref } from "vue";

const path = ref('')

const electronAPI = window.electronAPI

async function sendPing() {
  const response = await electronAPI.ping()
  console.log(response)
}

onMounted(async () => {
  await sendPing()
}) 

</script>

<template>
  <img alt="Vite logo" width="120" src="./assets/vite.svg" />
  <img alt="Vue logo" width="120" src="./assets/logo.png" />
  <img alt="Electron logo" width="120" src="./assets/electron.png" />
  <img alt="TS logo" width="120" src="./assets/ts.png" />
  <HelloWorld msg="Vite + Vue 3 + Electron + TypeScript" />
  <br />
  <p class="plugins">Plugins</p>
  <img alt="vue router logo" width="120" src="./assets/vueRouter.png" />
  <img alt="pinia logo" width="120" src="./assets/pinia.svg" />

  <h1>Hello World!</h1>
    We are using Node.js <span id="node-version">{{electronAPI['node']() }}</span>,
    Chromium <span id="chrome-version">{{electronAPI['chrome']() }}</span>,
    and Electron <span id="electron-version">{{electronAPI['electron']() }}</span>.
    <button @click="sendPing()">ping</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
</style>
