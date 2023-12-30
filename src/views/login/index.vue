<script setup>
import LoginPanel from "@/views/login/LoginPanel.vue"
import {useRouter} from "vue-router"

const router = useRouter()

const login = (username, password) => {
    console.log(username, password)
}

const register = () => {
    router.push("/register")
}
</script>

<template>
<div class="main">
    <LoginPanel @login="login" @register="register"/>
</div>
</template>

<style scoped lang="scss">
.main {
    background: #e0e0e0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>