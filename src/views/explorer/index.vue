<script setup>
import ResourceItem from "@/views/explorer/resource-item.vue"
import {fileApi} from "@/apis"
import {fileToMd5} from "@/utils/file"
import {NInput} from "naive-ui"

const dialog = useDialog()
const parentIds = ref([])
const parentId = computed(() => parentIds.value.length === 0 ? null : parentIds.value[parentIds.value.length - 1])
const files = ref([])
const uploadRef = ref(null)
const selectedIds = ref([])
const newFolderName = ref("")

async function enterFolder(id) {
    selectedIds.value = []
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
    selectedIds.value = []
    parentIds.value.pop()
    fetchFiles(parentId.value)
}

async function createFolder() {
    newFolderName.value = ""
    dialog.create({
        showIcon: false,
        closable: false,
        title: "新建文件夹",
        content: () => h(NInput, {
            placeholder: "请输入文件夹名称",
            autofocus: true,
            onInput: value => newFolderName.value = value
        }),
        negativeText: "取消",
        positiveText: "创建",
        onPositiveClick: async () => {
            await fileApi.createFolder(parentId.value, newFolderName.value ? newFolderName.value : "新建文件夹")
            await fetchFiles(parentId.value)
        }
    })
}

onMounted(() => {
    fetchFiles(parentId.value)
})
</script>

<template>
<div class="explorer">
    <NFlex class="action" :wrap="false" align="center">
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
    <NCheckboxGroup class="display" v-model:value="selectedIds">
        <NScrollbar>
            <NFlex align="start">
                <resource-item v-for="file in files" :key="file.id" :is-folder="file.folder" :name="file.name"
                               :id="file.id" @clickResource="enterFolder"/>
            </NFlex>
        </NScrollbar>
    </NCheckboxGroup>
</div>
</template>

<style scoped lang="scss">
.explorer {
    height: 100%;
    width: 100%;
    $action-height: 50px;

    .action {
        height: $action-height;
    }

    .display {
        height: calc(100% - #{$action-height});
    }
}

.arrow {
    height: 16px;
    width: 16px;
}
</style>