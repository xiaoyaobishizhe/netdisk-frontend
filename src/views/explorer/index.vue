<script setup>
import {fileApi} from "@/apis"
import {fileToMd5} from "@/utils/file"
import {NInput} from "naive-ui"
import ResourceDisplayWindow from "@/components/resource/resource-display-window.vue"

const dialog = useDialog()
const parentIds = ref([])
const parentId = computed(() => parentIds.value.length === 0 ? null : parentIds.value[parentIds.value.length - 1])
const files = ref([])
const uploadRef = ref(null)
const selectedIds = ref([])
const newFolderName = ref("")

async function fetchFiles(parentId) {
    files.value = await fileApi.listFiles(parentId)
}

async function enterFolder(id) {
    for (const file of files.value) {
        if (file.id === id && file.folder) {
            selectedIds.value = []
            parentIds.value.push(id)
            await fetchFiles(parentId.value)
            break
        }
    }
}

async function back() {
    selectedIds.value = []
    parentIds.value.pop()
    await fetchFiles(parentId.value)
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

function selectAll() {
    const targetIds = []
    for (let file of files.value) {
        targetIds.push(file.id)
    }
    selectedIds.value = targetIds
}

function reverseSelect() {
    const targetIds = []
    for (let file of files.value) {
        if (!selectedIds.value.includes(file.id)) {
            targetIds.push(file.id)
        }
    }
    selectedIds.value = targetIds
}

function cancelSelect() {
    selectedIds.value = []
}

onMounted(() => {
    fetchFiles(parentId.value)
})
</script>

<template>
<div class="explorer">
    <n-flex class="action" :wrap="false" align="center">
        <n-button secondary type="info" :disabled="!parentId" @click="back" circle>
            <template #icon><img class="arrow" src="@/assets/images/arrow-left.png" alt=""></template>
        </n-button>
        <div>
            <n-upload ref="uploadRef" :show-file-list="false" :custom-request="uploadFile">
                <n-button type="info" round>上传文件</n-button>
            </n-upload>
        </div>
        <n-button @click="createFolder" type="info" round>新建文件夹</n-button>
        <n-button @click="selectAll" type="info" round>全选</n-button>
        <n-button v-if="selectedIds.length > 0" @click="reverseSelect" type="info" round>反选</n-button>
        <n-button v-if="selectedIds.length > 0" @click="cancelSelect" type="info" round>取消</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round>复制</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round>移动</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round>删除</n-button>
    </n-flex>
    <div class="display">
        <resource-display-window :click-resource-callback="enterFolder" :files="files"
                                 v-model:selected-ids="selectedIds"/>
    </div>
</div>
</template>

<style scoped lang="scss">
.explorer {
    height: 100%;
    width: 100%;
    $action-height: 50px;

    .action {
        height: $action-height;

        .arrow {
            height: 16px;
            width: 16px;
        }
    }

    .display {
        height: calc(100% - #{$action-height});
    }
}
</style>