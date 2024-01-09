<script setup>

import DisplayItem from "@/views/home/display-item.vue";
</script>

<template>
<div class="display-window">
    <DisplayItem :is-folder="true" name="我的资源" datetime="2024-01-09 18:35"/>
    <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35"/>
    <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35"/>
    <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35"/>
    <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35"/>
    <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35"/>
    <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35"/>
</div>
</template>

<style scoped lang="scss">
.display-window {
    height: 500px;
    width: 800px;
    border: 1px solid #000;
    display: flex;
    align-items: start;
    flex-wrap: wrap;
}
</style>