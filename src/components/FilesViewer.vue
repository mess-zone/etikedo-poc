<template>
    <table class="table">
        <tbody>
            <tr class="clickable" @click="emit('back')">
                <td class="icon-cell">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M384 480h48c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224H144c-11.4 0-21.9 6-27.6 15.9L48 357.1V96c0-8.8 7.2-16 16-16H181.5c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8H416c8.8 0 16 7.2 16 16v32h48V160c0-35.3-28.7-64-64-64H298.5c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H87.7 384z"/></svg>
                </td>
                <td>... (go back)</td>
                <td></td>
            </tr>
            <tr
                v-for="item in files"
                :key="item.name"
                :class="{ clickable: item.directory || item.path.endsWith('.etikedo.json') }"
                @click="onFileClick(item)"
                >
                <td class="icon-cell">
                    <svg v-if="item.directory" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M384 480h48c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224H144c-11.4 0-21.9 6-27.6 15.9L48 357.1V96c0-8.8 7.2-16 16-16H181.5c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8H416c8.8 0 16 7.2 16 16v32h48V160c0-35.3-28.7-64-64-64H298.5c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H87.7 384z"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"/></svg>
                </td>
                <td>{{ item.name }}</td>
                <td class="align-right">{{ item.size }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import { FileInfo } from '../renderer';
import { useRouter } from 'vue-router'
import { useMediaStore } from '../stores/media';

const emit = defineEmits(['folderclick', 'back'])
defineProps<{
    files: FileInfo[]
}>()

const mediaStore = useMediaStore()

const router = useRouter()


function onFileClick(file: FileInfo) {
    if(file.directory) {
        emit('folderclick', file)
    } else {
        if(file.path.endsWith('.etikedo.json')) {
            router.push({ name: 'Resource', query: { path: file.path } })
            // router.push({ name: 'Project', query: { path: file.path } })
        }
    }
}
</script>
<style scoped>

.table {
  width: 100%;
  font-size: 1em;
}

/* .table tr {
  border-bottom: 1px solid black;
} */

.table td {
  padding: 15px 10px;
  border-bottom: 1px solid #00000015;
}

.clickable {
    cursor: pointer;
}

.clickable:hover {
    background-color: #00000015
}

.icon-cell {
    width: 3em;
    text-align: center;
}

.align-right {
    text-align: right;
}
</style>