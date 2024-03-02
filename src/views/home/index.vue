<script setup>
import Header from "@/views/home/header.vue"
import iconImg from "@/assets/images/icon.png"
import RecycleBinImg from "@/assets/images/recycle-bin.png"
import ShareImg from "@/assets/images/share.png"
import {useRouter} from "vue-router"

const router = useRouter()
const asideItem = [
    {icon: iconImg, title: "首页", path: "/home/explorer"},
    {icon: RecycleBinImg, title: "回收站", path: "/home/recycle-bin"},
    {icon: ShareImg, title: "分享", path: "/home/share"}
]
const asideItemActive = ref(0)

const handleAsideItemClick = (index) => {
    asideItemActive.value = index
    router.push(asideItem[index].path)
}
</script>

<template>
<div class="header">
    <Header/>
</div>
<NFlex class="aside" vertical align="center" :size="[0, 1]">
    <NFlex v-for="(item, index) in asideItem" class="aside__item" @click="handleAsideItemClick(index)"
           :class="{'aside__item--active': index === asideItemActive}"
           vertical justify="center" align="center" :size="0">
        <img class="icon" :src="item.icon" alt="">
        <span class="title">{{item.title}}</span>
    </NFlex>
</NFlex>
<div class="main">
    <RouterView/>
</div>
</template>

<style scoped lang="scss">
$header-height: 56px;
$aside-width: 80px;

.header {
    height: $header-height;
    width: 100vw;
    position: fixed;
    top: 0;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .05);
}

.aside {
    height: calc(100vh - #{$header-height});
    width: $aside-width;
    position: fixed;
    top: $header-height;
    box-shadow: 2px 0 6px 0 rgba(0, 0, 0, .05);
    padding: 20px 0 30px 0;
    user-select: none;

    &__item {
        font-size: 12px;
        height: 58px;
        width: 58px;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
            background-color: #f4f5f9;
        }

        &--active {
            background-color: #f2faff !important;
            color: #06a7ff;
        }

        .icon {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
        }

        .title {
            display: block;
            text-align: center;
        }
    }
}

.main {
    width: calc(100vw - #{$aside-width});
    height: calc(100vh - #{$header-height});
    position: fixed;
    top: $header-height;
    left: $aside-width;
    padding: 10px;
}
</style>