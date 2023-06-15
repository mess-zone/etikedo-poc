<template>
    <h2> <router-link to="/">fechar</router-link> Video view</h2>
    <div class="video-container">
        <video
            controls 
            :src="fileUrl"
        ></video>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';


const fileUrl = ref('D:\\gilma\\Videos\\Captures\\Aela _ Workshop (11ª Edição) - Migrando para UX_UI Design - Google Chrome 2021-06-18 12-05-32.mp4')
</script>

<style scoped>
.video-container {
    background-color: rgb(255, 0, 128);
    aspect-ratio: 16/9;
    display: flex;
}

.video-container video {
    inset: 0;
    max-width: 100%;
}
</style>