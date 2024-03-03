<script setup>
import {fileApi, shareApi} from "@/apis/index.js"

const props = defineProps({
    // 模态框的类型，值为“复制”、“移动”或“保存”
    type: {type: String, required: true},
    selectedIds: {type: Array, required: true},
    token: {type: String, required: false},
})
const emits = defineEmits(["close"])
const show = ref(false)       // 是否显示模态框
const parentIds = ref([])     // 层层递进的父文件夹id
// 当前所在的父文件夹id
const parentId = computed(() => parentIds.value.length === 0 ? null : parentIds.value[parentIds.value.length - 1])
const folderPaths = ref([])   // 层层递进的父文件夹名称
const folders = ref([])

async function handleClickBack() {
    parentIds.value.pop()
    folderPaths.value.pop()
    folders.value = await fileApi.listFolders(parentId.value)
}

async function handleClickFolder(id, name) {
    parentIds.value.push(id)
    folderPaths.value.push(name)
    folders.value = await fileApi.listFolders(parentId.value)
}

async function handleClickConfirm() {
    if (props.type === "复制") {
        await fileApi.copy(props.selectedIds.join(","), parentId.value)
    } else if (props.type === "移动") {
        await fileApi.move(props.selectedIds.join(","), parentId.value)
    } else if (props.type === "保存") {
        await shareApi.save(props.token, props.selectedIds.join(","), parentId.value)
    }
    show.value = false
}

watch(show, async (value) => {
    if (value) {
        parentIds.value = []
        folderPaths.value = []
        folders.value = await fileApi.listFolders(parentId.value)
    } else {
        emits("close")
    }
})

function setShow(value) {
    show.value = value
}

defineExpose({
    setShow
})
</script>

<template>
<n-modal class="panel" v-model:show="show">
    <n-card :title="type + '到'" closable @close="show = false">
        <div class="folder-list">
            <n-flex class="path" align="center">
                <n-button text v-if="parentId" @click="handleClickBack">返回上一级</n-button>
                根路径
                <div v-for="path in folderPaths">/ {{path}}</div>
            </n-flex>
            <n-scrollbar>
                <n-flex :vertical="true" :size="0">
                    <n-flex class="folder" align="center" :size="0"
                            @click="handleClickFolder(folder.id, folder.name)"
                            v-for="folder in folders" :key="folder.id">
                        <img src="../../../assets/images/folder.png" alt=""/>
                        {{folder.name}}
                    </n-flex>
                </n-flex>
            </n-scrollbar>
        </div>
        <template #footer>
            <n-button round @click="show = false">取消</n-button>
            <n-button type="info" round @click="handleClickConfirm">{{type}}到此</n-button>
        </template>
    </n-card>
</n-modal>
</template>

<style scoped lang="scss">
.panel {
    width: 720px;
    border-radius: 12px;

    .folder-list {
        height: 320px;

        .path {
            height: 40px;
            background-color: #fafafc;
            font-size: 12px;
        }

        .folder {
            height: 50px;
            font-size: 12px;
            color: #03081a;
            user-select: none;
            cursor: pointer;

            &:hover {
                background-color: #f7f9fc;
            }

            img {
                height: 40px;
            }
        }
    }
}
</style>