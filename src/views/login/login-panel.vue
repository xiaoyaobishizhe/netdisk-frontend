<script setup>
const emits = defineEmits(["login", "register"])

const formRef = ref(null)
const loginForm = reactive({
    username: "",
    password: ""
})
const rules = {
    username: {required: true, message: "请输入账号", trigger: ["blur", "input"]},
    password: {required: true, message: "请输入密码", trigger: ["blur", "input"]}
}

const verifyInput = value => {
    return !value || /^(\d|\w)+$/.test(value)
}

const login = () => {
    formRef.value.validate().then(value => {
        emits("login", loginForm.username, loginForm.password)
    }).catch(error => {
    })
}
</script>

<template>
<div class="panel">
    <div class="panel__banner">
        <img class="icon" src="@/assets/images/icon.png" alt=""/>
        <h2 class="title">逍遥云盘</h2>
    </div>
    <n-form :model="loginForm" :rules="rules" ref="formRef">
        <n-form-item class="panel__username" path="username">
            <n-input round size="large" placeholder="账号" clearable :maxlength="16" autofocus
                     v-model:value="loginForm.username" :allow-input="verifyInput"
            />
        </n-form-item>
        <n-form-item class="panel__password" path="password">
            <n-input round size="large" placeholder="密码" type="password" show-password-on="mousedown"
                     :maxlength="16" v-model:value="loginForm.password" :allow-input="verifyInput"
            />
        </n-form-item>
        <div class="panel__submit">
            <n-button class="panel__login" type="info" round size="large" @click="login">登录</n-button>
            <n-button class="panel__register" type="info" round size="large" @click="$emit('register')">
                注册
            </n-button>
        </div>
    </n-form>
</div>
</template>

<style scoped lang="scss">
$item-margin-top: 0.5em;

.panel {


    background: #e0e0e0;
    box-shadow: 20px 20px 60px #bebebe,
    -20px -20px 60px #ffffff;
    width: 25em;
    border-radius: 2em;
    padding: 2em 3em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__banner {
        display: flex;
        justify-content: center;

        .icon {
            height: 2.6em;
            width: 2.6em;
            position: relative;
            top: 0.5em;
        }

        .title {
            font-size: 2.2em;
            margin: 0 0 0 0.2em;
        }
    }

    &__username {
        margin-top: $item-margin-top * 3;
        display: flex;
        flex-direction: column;
    }

    &__password {
        margin-top: $item-margin-top;
        display: flex;
        flex-direction: column;
    }

    &__submit {
        margin-top: $item-margin-top;
        display: flex;
        justify-content: space-around;
    }
}
</style>