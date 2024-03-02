<script setup>
import {useRoute, useRouter} from "vue-router"
import {shareApi, userApi} from "@/apis"

const router = useRouter()
const route = useRoute()
const code = ref("")
const pwd = ref("")
const avatar = ref("")
const nickname = ref("")

async function handleClickTakeFile() {
    const token = await shareApi.getAccessToken(code.value, pwd.value)
    localStorage.setItem(`access-token:${code.value}`, token)
    router.push("/s/" + code.value)
}

onMounted(async () => {
    code.value = route.query.code
    if ("pwd" in route.query) {
        pwd.value = route.query.pwd
    }
    const userInfo = await userApi.info(await shareApi.getUserId(code.value))
    avatar.value = userInfo.avatar
    nickname.value = userInfo.nickname
})
</script>

<template>
<n-flex class="main" align="center" justify="center">
    <n-flex class="container" vertical justify="space-around">
        <n-flex>
            <n-avatar round :size="48" :src="avatar"/>
            <span>{{nickname}}</span>
        </n-flex>
        <n-input v-model:value="pwd" type="text" placeholder="请输入提取码，不区分大小写"/>
        <n-button type="info" @click="handleClickTakeFile">提取文件</n-button>
    </n-flex>
</n-flex>
</template>

<style scoped lang="scss">
.main {
    height: 100vh;

    .container {
        height: 300px;
        width: 500px;
    }
}
</style>