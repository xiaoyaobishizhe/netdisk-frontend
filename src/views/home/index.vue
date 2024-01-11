<script setup>
import DisplayWindow from "@/views/home/display-window.vue"
import Header from "@/views/home/header.vue"
import useUserStore from "@/stores/user"

const userStore = useUserStore()
userStore.fetchUserInfo()
</script>

<template>
<Header/>
<DisplayWindow/>
</template>

<style scoped lang="scss">

</style>