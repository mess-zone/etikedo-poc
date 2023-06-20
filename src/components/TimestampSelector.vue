<template>
    <div>
        <button @click="decrement">-</button>
        {{ formated }}
        <button @click="increment">+</button>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

export interface Props {
    modelValue: number,
    min?: number,
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
})

const emit = defineEmits<{
    'update:model-value': [id: number],
}>()

const STEP = 0.5

const timestamp = ref(props.modelValue)

function decrement() {
    console.log('-')
    timestamp.value -= STEP
    emit('update:model-value', timestamp.value)
}

function increment() {
    console.log('+')
    timestamp.value += STEP
    emit('update:model-value', timestamp.value)
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