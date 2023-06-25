<template>
    <div>
        project view
        <router-link to="/">fechar</router-link> 
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

onMounted(() => {
    console.log(route.query.path)
})
</script>