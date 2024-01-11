<script setup>
import DisplayItem from "@/views/home/display-item.vue"
import {fileApi} from "@/apis"
import {fileToMd5, formatSize} from "@/utils/file"
import {formatWithoutYear} from "@/utils/datetime"
import {computed} from "vue";

const parentIds = ref([])
const parentId = computed(() => parentIds.value.length === 0 ? null : parentIds.value[parentIds.value.length - 1])
const files = ref([])
const uploadRef = ref(null)
const selectedIds = ref([])

async function enterFolder(id) {
    parentIds.value.push(id)
    files.value = await fileApi.listFiles(id)
}

async function fetchFiles(parentId) {
    files.value = await fileApi.listFiles(parentId)
}

async function uploadFile(options) {
    const file = options.file.file
    uploadRef.value.clear()
    const md5 = await fileToMd5(file)
    const {
        chunkSize,
        currentChunk,
        totalChunk,
        canSecUpload,
        existSameFile
    } = await fileApi.sharding(md5, file.name, file.size, parentId.value)
    if (!existSameFile && !canSecUpload) {
        for (let chunk = currentChunk + 1; chunk <= totalChunk; chunk++) {
            const {key, formData, uploadUrl} = await fileApi.applyUploadChunk(md5, chunk)
            await fileApi.uploadChunk(uploadUrl, key, formData,
                file.slice((chunk - 1) * chunkSize, (chunk - 1) * chunkSize + chunkSize > file.size ?
                    file.size : (chunk - 1) * chunkSize + chunkSize))
            await fileApi.finishUploadChunk(md5, chunk)
        }
        await fileApi.finishSharding(md5)
        await fetchFiles(parentId.value)
    } else if (canSecUpload) {
        await fetchFiles(parentId.value)
    }
}

function back() {
    parentIds.value.pop()
    fetchFiles(parentId.value)
}

async function createFolder() {
    await fileApi.createFolder(parentId.value, "新建文件夹")
    await fetchFiles(parentId.value)
}

onMounted(() => {
    fetchFiles(parentId.value)
})
</script>

<template>
<NFlex :wrap="false">
    <NButton secondary type="info" :disabled="!parentId" @click="back" circle>
        <template #icon><img class="arrow" src="@/assets/images/arrow-left.png" alt=""></template>
    </NButton>
    <div>
        <NUpload ref="uploadRef" :show-file-list="false" :custom-request="uploadFile">
            <NButton type="info" round>上传文件</NButton>
        </NUpload>
    </div>
    <NButton @click="createFolder" type="info" round>新建文件夹</NButton>
</NFlex>
<NCheckboxGroup v-model:value="selectedIds">
    <NFlex class="display-window" align="start">
        <DisplayItem v-for="file in files" :is-folder="file.folder" :name="file.name"
                     :datetime="formatWithoutYear(file.updateTime)" :id="file.id" :size="formatSize(file.size)"
                     @select="enterFolder"/>
    </NFlex>
</NCheckboxGroup>
</template>

<style scoped lang="scss">
.display-window {
    height: 500px;
    width: 800px;
    border: 1px solid #000;
}

.arrow {
    height: 16px;
    width: 16px;
}
</style>