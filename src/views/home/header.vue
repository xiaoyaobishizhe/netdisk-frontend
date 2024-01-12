<script setup>
import {storeToRefs} from "pinia"
import useUserStore from "@/stores/user"

const userStore = useUserStore()
const {userInfo} = storeToRefs(userStore)

userStore.fetchUserInfo()
</script>

<template>
<div class="header">
    <div class="header__banner">
        <img class="icon" src="@/assets/images/icon.png" alt=""/>
        <span class="title">逍遥云盘</span>
    </div>
    <div class="header__user">
        <div class="image"></div>
        <div class="nickname">{{userInfo.nickname}}</div>
        <img class="down" src="@/assets/images/down.png" alt="">
    </div>
</div>
</template>

<style scoped lang="scss">
.header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 1em;

    &__banner {
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;

        .icon {
            width: 3.2em;
            height: 3.2em;
        }

        .title {
            margin-left: 0.4em;
            font-size: 1.8em;
        }
    }

    &__user {
        display: flex;
        align-items: center;
        justify-content: center;

        .image {
            width: 2.8em;
            height: 2.8em;
            border-radius: 50%;
            background: #e0e0e0;
        }

        .nickname {
            margin-left: 0.4em;
        }

        .down {
            width: 1.5em;
            height: 1.5em;
            margin-left: 0.4em;
            transition: transform 0.3s ease;
        }

        &:hover {
            .down {
                transform: rotate(180deg);
            }
        }
    }
}
</style>