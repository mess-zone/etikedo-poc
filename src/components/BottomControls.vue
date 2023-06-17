<template>
    <div class="bottom-controls">
        <Slider :value="0" :disabled="false"/>
    </div>
</template>
<script setup lang="ts">
import Slider from './Slider.vue';
</script>
<style scoped>
.bottom-controls {
    /* background-color: burlywood; */
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    justify-content: space-between;
    box-shadow: 8px 0px 6px #00000061;
    z-index: 1;
}
</style>