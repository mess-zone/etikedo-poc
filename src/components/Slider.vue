<template>
    <div class="slider">
        <div class="slider__bar">
            <div class="slider__handle"></div>
            <div class="slider__fill"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>

.slider {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 24px;
}

.slider__bar {
    width: 100%;
    height: 4px;
    background-color: #ccc;
    position: relative;
}

.slider__handle {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: black;
    position: absolute;
    left: 0;
    top: calc(50% - (var(--size)/2));
}

.slider__fill {

}
</style>