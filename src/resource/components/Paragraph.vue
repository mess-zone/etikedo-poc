<template>
    <p>
        <Word v-for="word of words" :key="word.id" :word="word" />
    </p>
</template>
<script setup lang="ts">
import { WordData } from '@/resource/types';
import { toRefs } from 'vue';
import Word from '@/resource/components/Word.vue'

interface Props {
    words: WordData[]
}

const props = defineProps<Props>()

const { words } = toRefs(props)
</script>
<style scoped>
p {
    font-size: 16px;
    white-space: pre-wrap;
    word-break: break-word;
} 
</style>