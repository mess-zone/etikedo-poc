<template>
    <p>
        <template v-for="region of regions" :key="region.id">
            <span class="text_highlight" v-if="region.isHighlighted">
                <Word v-for="word of region.words" :key="word.id" :word="word" />
            </span>
            <template v-else>
                <Word v-for="word of region.words" :key="word.id" :word="word" />
            </template>
        </template>
    </p>
</template>
<script setup lang="ts">
import { WordData } from '@/resource/types';
import { computed, toRefs } from 'vue';
import Word from '@/resource/components/Word.vue'

interface Props {
    words: WordData[]
}

const props = defineProps<Props>()

const { words } = toRefs(props)

const regions = computed(() => {
    return  [
        {
            id: '0',
            isHighlighted: true,
            words: words.value.slice(0, 4),
        },
        {
            id: '1',
            isHighlighted: false,
            words: words.value.slice(4, 7),
        },
        {
            id: '2',
            isHighlighted: true,
            words: words.value.slice(8, 23),
        },
        {
            id: '3',
            isHighlighted: false,
            words: words.value.slice(23, 50),
        },
        {
            id: '4',
            isHighlighted: true,
            words: words.value.slice(50, 99),
        },
        {
            id: '5',
            isHighlighted: false,
            words: words.value.slice(99),
        },
    ]
})
</script>
<style scoped>
p {
    font-size: 16px;
    white-space: pre-wrap;
    word-break: break-word;
} 

.text_highlight {
    background-color: rgba(255, 255, 0, 0.25);
    padding: 0.5em 0;
    line-height: 2em;
}
.text_highlight:hover {
    background-color: rgba(255, 255, 0, 0.7);
}
</style>