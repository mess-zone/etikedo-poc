<template>
    track id: <input type="text" v-model="id"> {{ id }}
</template>
<script setup lang="ts">
import { useTrack } from '../composables/track';

const { id } = useTrack()
</script>