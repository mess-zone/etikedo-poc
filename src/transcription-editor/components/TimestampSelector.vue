<template>
    <div>
        <button @click="decrement">-</button>
        {{ formated }}
        <button @click="increment">+</button>
    </div>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';

export interface Props {
    modelValue: number,
    min?: number,
    step?: number,
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    step: 1,
})

const emit = defineEmits<{
    'update:model-value': [id: number],
}>()


const { modelValue: timestamp } = toRefs(props)

function decrement() {
    let newValue = timestamp.value - props.step
    if(newValue < props.min) {
        newValue = props.min
    }
    emit('update:model-value', newValue)
}

function increment() {
    let newValue = timestamp.value + props.step
    emit('update:model-value', newValue)
}

const formated = computed(() => {
    return formatDuration(timestamp.value)
})

function formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const milliseconds = Math.floor((durationInSeconds % 1) * 1000);
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

</script>