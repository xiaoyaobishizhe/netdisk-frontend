<script setup>
import DisplayItem from "@/views/home/display-item.vue"

const selectedIds = ref([])
</script>

<template>
<NCheckboxGroup v-model:value="selectedIds">
    <NFlex class="display-window" align="start">
        <DisplayItem :is-folder="true" name="我的资源" datetime="2024-01-09 18:35" id="1"/>
        <DisplayItem :is-folder="false" name="文本文件.txt" size="4KB" datetime="2024-01-09 18:35" id="2"/>
    </NFlex>
</NCheckboxGroup>
</template>

<style scoped lang="scss">
.display-window {
    height: 500px;
    width: 800px;
    border: 1px solid #000;
}
</style>