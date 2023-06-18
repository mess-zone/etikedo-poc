<template>
    <div class="slider"  v-on:mousedown="onSliderMouseDown">
        <div class="slider__bar" ref="bar">
            <div class="slider__handle" ref="handle" :style="handleStyle"></div>
            <div class="slider__fill" :style="fillStyle"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

export interface Props {
  min?: number,
  max?: number,
  disabled?: boolean,
  modelValue: number,
}

const emit = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 1,
    disabled: false,
})

const isDragging = ref(false)
const barWidth = ref(0)

const bar = ref(null)
const handle = ref(null)

const limitNumberWithinRange = (num: number, MIN: number, MAX: number) => Math.min(Math.max(num, MIN), MAX)


const { width: windowWidth } = useWindowSize()

function calculateDimentions() {
    barWidth.value = bar.value.offsetWidth
}

watch(
    windowWidth,
    calculateDimentions
)

const delta = computed(() => {
    const value = limitNumberWithinRange(props.modelValue, props.min, props.max)
    return (value - props.min) / (props.max - props.min)
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
    calculateDimentions()
})

function valueChanged(value: number) {
    emit('update:modelValue', value)
}

function parseMouseMove(e: MouseEvent) {
    // const offsetX = e.offsetX
    const offsetX = e.clientX - bar.value.getBoundingClientRect().x
    const normalizedValue = offsetX / barWidth.value
    const value = (normalizedValue * (props.max - props.min)) + props.min
    
    valueChanged(limitNumberWithinRange(value, props.min, props.max))
}

function handleStart(e: MouseEvent) {
    isDragging.value = true
    
    parseMouseMove(e)
}

function handleStop(e: MouseEvent) {
    isDragging.value = false
}

function onSliderMouseDown(e: MouseEvent) {
    console.log('onSliderMouseDown')
    handleStart(e)

    // window.addEventListener('mousemove', onMouseMove, { passive: true, capture: true })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onSliderMouseUp, { passive: false })
}

function onMouseMove(e: MouseEvent) {
    console.log('onMouseMove')
    // TODO throttle
    if(isDragging.value) {
        parseMouseMove(e)
    }
}

function onSliderMouseUp(e: MouseEvent) {
    console.log('onSliderMouseUp')
    e.stopPropagation()
    e.preventDefault()

    handleStop(e)

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onSliderMouseUp)
}

</script>

<style scoped>

.slider {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 24px;
    /* background-color: pink; */
    position: relative;
    user-select: none;
}

.slider__bar {
    width: 100%;
    height: 4px;
    background-color: #ccc;
    position: relative;
    pointer-events: none;
}

.slider__handle {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    /* background-color: red; */
    position: absolute;
    left: 0;
    top: calc(50% - (var(--size)/2));
    z-index: 2;
    margin-left: calc(var(--size) / -2);
    pointer-events: none;
}

.slider__handle::after {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: red;
    display: block;
    scale: .2;
    transition: scale 200ms ease-out;
}

.slider:hover .slider__handle::after {
    scale: 1;
}

.slider__fill {
    height: 100%;
    width: 100%;
    background-color: red;
    pointer-events: none;
}
</style>