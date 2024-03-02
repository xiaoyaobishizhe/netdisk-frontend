<script setup>
import {useRoute} from "vue-router"

const route = useRoute()
const code = route.params.code
const token = localStorage.getItem(`access-token:${code}`)


</script>

<template>

</template>

<style scoped lang="scss">

</style>