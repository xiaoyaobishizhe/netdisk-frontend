<script setup>
import LoginPanel from "@/views/login/LoginPanel.vue"
import {useRouter} from "vue-router"
import {user} from "@/apis"

const router = useRouter()
const message = useMessage()

const login = (username, password) => {
    user.login(username, password).then(res => {
        localStorage.setItem("token", res.data)
        router.push("/home")
    }).catch(err => {
        message.warning(err.message)
    })
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