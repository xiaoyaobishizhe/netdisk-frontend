<script setup>
import {fileApi} from "@/apis/index.js"
import {fileToMd5} from "@/utils/file/index.js"
import {NInput} from "naive-ui"
import ShareModal from "@/views/home/explorer/share-modal.vue"
import FolderModal from "@/views/home/explorer/folder-modal.vue"
import axios from "axios"

const dialog = useDialog()
const parentIds = ref([])
const parentId = computed(() => parentIds.value.length === 0 ? null : parentIds.value[parentIds.value.length - 1])
const folderPaths = ref([])
const files = ref([])
const selectedIds = ref([])
const uploadRef = ref(null)
const newName = ref("")
const folderModelRef = ref()       // 文件夹模态框的引用
const folderModelType = ref("")    // 文件夹模态框的类型
const shareModelRef = ref()        // 分享模态框的引用

async function fetchFiles(parentId) {
    selectedIds.value = []
    files.value = await fileApi.listFiles(parentId)
}

async function handleClickResource(id, name) {
    for (const file of files.value) {
        if (file.id === id) {
            if (file.folder) {
                parentIds.value.push(id)
                folderPaths.value.push(name)
                await fetchFiles(parentId.value)
            } else {
                // 下载文件
                const data = await fileApi.download(id)
                const response = await axios.get(data.url, {
                    responseType: 'blob', // 表明返回的数据是二进制数据
                });
                // 创建一个 Blob 对象
                const blob = new Blob([response.data]);
                // 创建一个临时的 <a> 元素
                const link = document.createElement('a');
                // 设置链接地址为 Blob 对象的URL
                link.href = window.URL.createObjectURL(blob);
                // 设置下载文件的名称
                link.setAttribute('download', data.filename);
                // 隐藏元素
                link.style.display = 'none';
                // 将链接添加到DOM中
                document.body.appendChild(link);
                // 模拟点击链接进行下载
                link.click();
                // 清理临时链接
                document.body.removeChild(link);
            }
            break
        }
    }
}

async function back() {
    parentIds.value.pop()
    folderPaths.value.pop()
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
    newName.value = ""
    dialog.create({
        showIcon: false,
        closable: false,
        title: "新建文件夹",
        content: () => h(NInput, {
            placeholder: "请输入文件夹名称",
            autofocus: true,
            onInput: value => newName.value = value
        }),
        negativeText: "取消",
        positiveText: "创建",
        onPositiveClick: async () => {
            await fileApi.createFolder(parentId.value, newName.value ? newName.value : "新建文件夹")
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

function handleClickCopy() {
    folderModelType.value = "复制"
    folderModelRef.value.setShow(true)
}

function handleClickMove() {
    folderModelType.value = "移动"
    folderModelRef.value.setShow(true)
}

async function onFolderModalClose() {
    // 文件夹模态框关闭时刷新当前文件列表
    await fetchFiles(parentId.value)
}

async function handleClickRename() {
    newName.value = ""
    dialog.create({
        showIcon: false,
        closable: false,
        title: "重命名",
        content: () => h(NInput, {
            placeholder: "请输入新名称",
            autofocus: true,
            onInput: value => newName.value = value
        }),
        negativeText: "取消",
        positiveText: "确定",
        onPositiveClick: async () => {
            await fileApi.rename(selectedIds.value.pop(), newName.value)
            await fetchFiles(parentId.value)
        }
    })
}

async function handleClickDelete() {
    dialog.success({
        showIcon: false,
        title: "确定删除",
        content: "确定删除所选的文件吗？",
        positiveText: "删除",
        negativeText: "取消",
        onPositiveClick: async () => {
            await fileApi.deleteFile(selectedIds.value.join(","))
            selectedIds.value = []
            await fetchFiles(parentId.value)
        }
    })
}

async function handleClickShare() {
    shareModelRef.value.setShowPanel(true)
}

onMounted(() => {
    fetchFiles(parentId.value)
})
</script>

<template>
<div class="explorer">
    <folder-modal ref="folderModelRef" :selected-ids="selectedIds" :type="folderModelType" @close="onFolderModalClose"/>
    <share-modal ref="shareModelRef" :selected-ids="selectedIds"/>
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
        <n-button v-if="selectedIds.length > 0" @click="handleClickShare" type="info" round>分享</n-button>
        <n-button v-if="selectedIds.length === 1" @click="handleClickRename" type="info" round>重命名</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round @click="handleClickCopy">复制</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round @click="handleClickMove">移动</n-button>
        <n-button v-if="selectedIds.length > 0" type="info" round @click="handleClickDelete">删除</n-button>
    </n-flex>
    <n-flex class="path" align="center">
        <span v-if="folderPaths.length === 0">全部文件</span>
        <n-breadcrumb v-else separator=">">
            <n-breadcrumb-item>全部文件</n-breadcrumb-item>
            <n-breadcrumb-item v-for="path in folderPaths">{{path}}</n-breadcrumb-item>
        </n-breadcrumb>
    </n-flex>
    <n-checkbox-group class="checkbox" v-model:value="selectedIds">
        <n-scrollbar>
            <n-flex align="start">
                <div class="resource" v-for="file in files" :key="file.id"
                     :class="{'resource--selected': selectedIds.indexOf(file.id) !== -1}">
                    <div class="top">
                        <div class="wrapper">
                            <n-checkbox :value="file.id"/>
                        </div>
                    </div>
                    <n-flex class="display" justify="center" @click="handleClickResource(file.id,file.name)">
                        <img v-if="file.folder" class="icon" alt=""
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRUExURUxpcf/MOv/OP//JNP/DKf+4EP/XUP/CKf+6Ff++Hf/RQ//VS//TR//aVf+3Ef+9FP+5A//DJP/fi//14P/ln/+xDf/dZ//ief/Rcf/pvP/GSpk9oQ4AAAAKdFJOUwD////H4/8in2nKcBCgAAAER0lEQVR42u2ai5LbKgyGCyRO4luabb2393/QY5AAgbEtEtxp5/BjY4Ftfb/Y7Uy64cePqqqqqqqqqqqqqr9Xlx0dC79+gt4TGlDN6XYU/tSgull91xu1s2QrQQJ0jIWbTq2EcnrottBdt/sBDm4u+5zfKxgQXYuv/z1Tp8IGThzoSAfnS/kFGM05Yjgumg3gUtTBFdIHmAVZH+OIgY7Pp+u2bpecnwBwgGARlgpof2XrzPz3ct5Kkk0NdGWtwniQJr0Il+IGJsg8dxPEeMGINt2dcgxMySIcdbKxHs39NFGSmZzspI2mifF7gJmhv38X0IOYOO8bIOa/v34V0df35HRjGLDr9jm/GiZaBMHEF70XPvLpDFx5BqD+Hf3+4sutwZlv4O13Qb25tGwDj7eiemQbUJ9FpdgGrOXNBdXH3Nb0AS2Q/UC5a2CFuAFcwoBozveP6BMtewU2UhPGu2WEnGFu+sOzDgb3Kdpo10AaZCgfEQLbAIyQs6pdAzFk4OcuY2A4WP8nAw02F5hBGQNNENjOAAJc4AGeyTXQBDyM4qqww7DBx+F/l/ioE89AQywTFBwwh7nd/ZSGMBxYBvw6Do09B09LZvfjhZWFs30DmxpY88NGBs4KYIJhP9sTenEF/iEDnTlt37lLIQMddoBoKMK0jj4HT+KdfAPdMj/++YjAuw4ZcC7kJ1kGOsJ1C9hgZQlCE2Gtp5SbXQNYS/DusjCHTNa7Vj3XwGpl26l5yjJQBlnUQIZ6e+11CH/rnMNSBnpPoLzesxAYj5430Ls+lTsWFB4OjXYN9Ijo+o1S/LBbsFJeiBgG4jr6Lq7iFeUZOEB/wkA7N+jshB60oFIGWne2kB55COo9MVKGgTauqsVaTB8AVmCu8j7HQJjSlriufsdD7goE8AWoz4I9a+BFBJF82sCTMAOUUuovt2zgbkkTPG9AuqtNKm2MAxgbrI/d92wotgGbW+e1V4llQU4kShz4aKGWRAwD7pXWv2sv5JtDuYVc166BTfsFxDOAP8AixJdXoJAEdkcbENgLiIWbsN2LBgTphEMIC6Yx3jb3iTgGSIIwuSRTcBHCViuEPROSruMYEIKsIg6EryhKu0Kjo7wViJLIRHoZLKtcdZIUywCumIyrklmoFwwcqT9hQJn9F+ZqAmUvuhUxoHxPIBSjhMcGLyiWAfI8JbrSRFiWOUxoNp74DSjCHjjSEcOAogBPoSQY+7QujnF2zu+J2TdgagCS5TgEzCvCIKWKBU4EliDYNaBUgFCkPEGwIp5WKnhzmQYD3grgUtMlTCBU2um29rdwPJWWrf0dBFd1qPa/vL68injg1q/0BjDGJo5TDiO1x2xFZmsYZ9/XJdjCls94rG87Y+54um0AMP/jzt3v9VM3J+ZWolvWXrZxDCHrGtlb/y7nGMFlbOmUs+Pscj3/LCrmNqqsTa05qluEq6qqqqqqqqqq/mL9B15hMo40ijfcAAAAAElFTkSuQmCC">
                        <img v-else class="icon" alt=""
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUxpcdDU2cTI0cvO1NXc4M7Z28zO1dTZ3tfc4NLW3M7S2PX29+zv8f3+/uTo6rW7yDt8+rwAAAAGdFJOUwBA+ZqiJeqKMf8AAARDSURBVGje7Zg/b+REGMazOtJfhShRJCy6nAQf4CQQokR0lKzQwLngpDvEeGiQrsAmoGuQcGZ0OtFgxVPcF7B3+5N9+wWsUFAlJNoiBZThfd8Z7+aPMzO3gc6P1/Z6/D6/93l9f6T11taoUaNGjfofNXn/w+v64G6w/85+NqS9UML2QTasvU/CAJ9lN+n32wUIjfBGlqW9I0noSJ/gCG+Z8oS2nmFw2XchET42tUlqCSlsSR8lJMJ+CgaOY4ArTc04nOxpSIRt6JagDzaeWg4A4Rse/BEmJgDHfmmS2nnsJBl/5AeQKaVPQl0TSpPRlyx92w/Axwe9EwxBNJ6kGAkGg5m8ESYci+0GloRzYHHwc1TijTBJeS9IkRAB3MaO9574E6R9rQljLpIV9r4XgIY+x8q31jcBALfu3xbwOBAgbiTcCwIInt8E+s0LkFzkAoyAECt/jks5rv3iBuQ5tbZmyXMJrpwbL1xx8cgNEGSBUkE+Y0OjNAxY9IwgwC8hMKCEkJgjx4lwOTeTuP5XmAgTl4bun2EuqLuwJ3nXCcAelFqiIzltqkUqe6igAT0A7CqkgEKZ75/MDrtuTr1xrDyXgrsTcAleyAAn+IAf1M2Rhs1xkQsnQEIpCUrlc/ID4dguGnkAF3RyaDW3C/nrAfZnPaD7caMEzw5XerkR4Kc1YL4JQL1aA/4oXx+g5GwN6DZIoPKLgD0FRFki1wdQCmoV1B5cAiCzDEigbJdSJk9n3aFlzLqjVJYlfEp/AklFEv4Vgb/rZrOqA1JVLwSRYXcDoA8G+LmqyErqZhVogf1VqXwjKK3K8nlVmea0wRlUHRNaewCQQEt1AjbQyo8X1bzUSmtZegC6VPpFZexX9JeGBMoN0Cj1rBrUyxICaO0GwF8DpU+GAQtg61J7E5S6ofqmauhYVbW5rOmmH6DLpq7rpqkrONVV0zS4w1qr6LYfcNCSua2blYhT74UB1FdtjVuvpjV73f5At/0JvmyJsFJt9/bbwGfw4BSrGzTVeG7NZdv+in8MHkAJLdhpO6gFC3yI0+Uw4CgKBbwYjLA4Dga8u1wM6UkooIiWp2ut/MudOBSw+/XydLlYLmHHo9WfZ6EAPf376fKajh5GuggEsN1/sqv+7PszeARFCCDWbOc8Sq78bHx4vhPjCIUHEGOPeLp7fk0YQBfMm6AA6eI64SxiDOixNwGDCEVcTHcuK4pYbPxuAERkrIihGRsS3PQAwFhAfxiCIaTHxLgMAn/MnAAoXLk0M0H0OgEimC+BZpjAGkz/y3O4AW7FtwUEJigGG/8nI4yAAMB2CMD5JiXy+6fO374fOa10/MIJePOKJ7L72s8+d78Kw7ppX2ztuBLZiylz//7fjmwzsACE9osjAMHzNurTSxabY2rteH7H9y7LNgZIFJkY5rs9+wJsbd2Jbnr89O1ewEvZ9xwKfzc7atSoUaM20L8RlnifTH3c0wAAAABJRU5ErkJggg==">
                    </n-flex>
                    <div class="name" @click="handleClickResource(file.id,file.name)">
                        <n-ellipsis :line-clamp="3" :tooltip="false">{{file.name}}</n-ellipsis>
                    </div>
                </div>
            </n-flex>
        </n-scrollbar>
    </n-checkbox-group>
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

    .path {
        height: 30px;
    }

    .checkbox {
        .resource {
            --top-wrapper-display: none;
            width: 128px;
            border-radius: 8px;
            user-select: none;

            &:hover {
                --top-wrapper-display: normal;
                cursor: pointer;
                background-color: #f7f9fc;
            }

            &--selected {
                --top-wrapper-display: normal;
                background-color: #f2faff !important;
            }

            .top {
                padding: 5px 0 0 5px;
                height: 23px;

                .wrapper {
                    height: 100px;
                    display: var(--top-wrapper-display);
                }
            }

            .display {
                height: 60px;

                .icon {
                    height: 60px;
                    width: 60px;
                }
            }

            .name {
                text-align: center;
                font-size: 12px;
                height: 65px;
                padding: 0 10px;
            }
        }
    }
}
</style>