<template>
    <span class="word">{{ word.text }} </span>{{ ' ' }}
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import { WordData } from '@/resource/types';

interface Props {
    word: WordData
}

const props = defineProps<Props>()

const { word } = toRefs(props)

</script>
<style scoped>
.word {
    padding: .5em 0;
    line-height: 2em;
} 

.word:hover {
    background-color: rgba(127, 255, 212, 0.5);
    border-radius: .25em;
}
</style>