<template>
    <div class="bottom-controls">
        <input type="number" v-model="inputValue" :min="min" :max="max" />
        {{ min }} - {{ max }}
        <Slider v-model="inputValue" :disabled="disabled" :min="min" :max="max"/>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Slider from './Slider.vue';

const inputValue = ref(20)
const disabled = ref(false)
const min = ref(20)
const max = ref(50)
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