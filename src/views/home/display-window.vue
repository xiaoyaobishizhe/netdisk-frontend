<script setup>
import DisplayItem from "@/views/home/display-item.vue"
import {fileApi} from "@/apis"
import {formatSize} from "@/utils/file"
import {formatWithoutYear} from "@/utils/datetime"

const selectedIds = ref([])
const files = ref([])

onMounted(() => {
    fetchFiles()
})

async function fetchFiles() {
    files.value = await fileApi.listFiles()
}
</script>

<template>
<NCheckboxGroup v-model:value="selectedIds">
    <NFlex class="display-window" align="start">
        <DisplayItem v-for="file in files" :is-folder="file.folder" :name="file.name"
                     :datetime="formatWithoutYear(file.updateTime)" :id="file.id" :size="formatSize(file.size)"/>
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