<template>
    <div class="slider">
        <div class="slider__bar" ref="bar">
            <div class="slider__handle" ref="handle" :style="handleStyle"></div>
            <div class="slider__fill" :style="fillStyle"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import throttle from 'lodash.throttle';

export interface Props {
  min?: number,
  max?: number,
  value: number,
  disabled: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 1,
})

const isDragging = ref(false)
const handleWidth = ref(0)
const barWidth = ref(0)

const bar = ref(null)
const handle = ref(null)

function calcDimensions() {
    handleWidth.value = handle.value.offsetWidth
    barWidth.value = bar.value.offsetWidth
    console.log(barWidth.value)
}

let onWindowResize = () => {
    calcDimensions()
    // console.log(e)
}

const delta = computed(() => {
    return props.value / props.max
})

const fillStyle = computed(() => {
    return {
        transformOrigin: 'left center',
        transform: `scaleX(${delta.value})`
    }
})

const handleStyle = computed(() => {
    return {
        transform: `translateX(${barWidth.value * delta.value}px)`
    }
})

onMounted(() => {
    calcDimensions()

    const throttled = throttle(onWindowResize, 200) as (this: Window, ev: UIEvent) => any
    window.addEventListener('resize', throttled)
})






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
    background-color: rgba(0, 0, 0, 0.342);
    position: absolute;
    left: 0;
    top: calc(50% - (var(--size)/2));
    z-index: 2;
    margin-left: calc(var(--size) / -2);
}

.slider__fill {
    height: 100%;
    width: 100%;
    background-color: red;
}
</style>