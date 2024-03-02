<script setup>
import {shareApi} from "@/apis/index.js"
import {useClipboard} from '@vueuse/core'

// 表格的列名
const columns = [
    {type: "selection"},
    {title: "分享名称", key: "name"},
    // {title: '大小', key: 'size'},
    {title: '分享时间', key: 'createTime'},
    // {title: '有效时间', key: 'timeout'}
]
const shares = ref([])            // 所有的分享
const selectedIds = ref([])       // 已选择的分享
const link = ref("")              // 分享链接
const {copy} = useClipboard()     // 剪切板
const message = useMessage()      // 通知
const dialog = useDialog()        // 对话框

async function fetchFiles() {
    selectedIds.value = []
    shares.value = await shareApi.listShares()
}

async function handleClickCopy() {
    link.value = await shareApi.link(selectedIds.value[0])
    copy(link.value)
    message.success("复制到剪切板了，粘贴给您的朋友吧~")
}

function handleClickCancel() {
    dialog.success({
        showIcon: false,
        title: "确认取消分享",
        content: "取消分享后，该条分享记录将被删除，好友将无法再访问此分享链接。 您确认要取消分享吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            await shareApi.deleteShares(selectedIds.value.join(","))
            message.success("取消外链分享成功")
            await fetchFiles()
        }
    })
}

onMounted(() => {
    fetchFiles()
})
</script>

<template>
<div class="share">
    <n-flex class="action" :wrap="false" align="center">
        <n-button v-if="selectedIds.length === 1" type="info" round @click="handleClickCopy">复制链接</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round @click="handleClickCancel">取消分享</n-button>
    </n-flex>
    <n-data-table :columns="columns" :data="shares" :row-key="share => share.id"
                  v-model:checked-row-keys="selectedIds"/>
</div>
</template>

<style scoped lang="scss">
.share {
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