<script setup>
import {recycleBinApi} from "@/apis/index.js"

const dialog = useDialog()
const columns = [
    {type: "selection"},
    {title: "文件名", key: "name"},
    // {title: '大小', key: 'size'},
    {title: '删除时间', key: 'deleteTime'},
    // {title: '有效时间', key: 'timeout'}
]
const files = ref([])
const selectedIds = ref([])

async function fetchFiles() {
    selectedIds.value = []
    files.value = await recycleBinApi.list()
}

function handleClickSelectAll() {
    const targetIds = []
    for (let file of files.value) {
        targetIds.push(file.id)
    }
    selectedIds.value = targetIds
}

function handleClickReverseSelect() {
    const targetIds = []
    for (let file of files.value) {
        if (!selectedIds.value.includes(file.id)) {
            targetIds.push(file.id)
        }
    }
    selectedIds.value = targetIds
}

function handleClickCancelSelect() {
    selectedIds.value = []
}

async function handleClickReturn() {
    dialog.success({
        showIcon: false,
        title: "确认还原",
        content: "确认还原选中的文件？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            await recycleBinApi.restore(selectedIds.value.join(","))
            selectedIds.value = []
            await fetchFiles()
        }
    })
}

async function handleClickDelete() {
    dialog.success({
        showIcon: false,
        title: "彻底删除",
        content: "文件删除后将无法恢复，您确认要彻底删除所选文件吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            await recycleBinApi.remove(selectedIds.value.join(","))
            selectedIds.value = []
            await fetchFiles()
        }
    })
}

async function handleClickClear() {
    dialog.success({
        showIcon: false,
        title: "清空回收站",
        content: "确认清空回收站？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            await recycleBinApi.clear()
            selectedIds.value = []
            await fetchFiles()
        }
    })
}

onMounted(async () => {
    await fetchFiles()
})
</script>

<template>
<div class="explorer">
    <n-flex class="action" :wrap="false" align="center">
        <n-button type="info" round @click="handleClickClear">清空回收站</n-button>
        <n-button type="info" round @click="handleClickSelectAll">全选</n-button>
        <n-button v-if="selectedIds.length > 0" @click="handleClickReverseSelect" type="info" round>反选</n-button>
        <n-button v-if="selectedIds.length > 0" @click="handleClickCancelSelect" type="info" round>取消</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round @click="handleClickReturn">还原</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round @click="handleClickDelete">删除</n-button>
    </n-flex>
    <n-data-table :columns="columns" :data="files" :row-key="file => file.id" v-model:checked-row-keys="selectedIds"/>
</div>
</template>

<style scoped lang="scss">
.explorer {
    height: 100%;
    width: 100%;

    .action {
        height: 50px;

        .arrow {
            height: 16px;
            width: 16px;
        }
    }
}
</style>