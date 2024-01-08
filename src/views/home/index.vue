<script setup>
import {fileApi} from "@/apis"
import {fileToMd5} from "@/utils/file"
import Header from "@/views/home/header.vue"
import useUserStore from "@/stores/user"

const userStore = useUserStore()
const uploadRef = ref(null)

userStore.fetchUserInfo()

const upload = async options => {
    const file = options.file.file
    uploadRef.value.clear()
    const md5 = await fileToMd5(file)
    const {
        chunkSize,
        currentChunk,
        totalChunk,
        canSecUpload,
        existSameFile
    } = await fileApi.sharding(md5, file.name, file.size)
    if (!existSameFile && !canSecUpload) {
        for (let chunk = currentChunk + 1; chunk <= totalChunk; chunk++) {
            const {key, formData, uploadUrl} = await fileApi.applyUploadChunk(md5, chunk)
            await fileApi.uploadChunk(uploadUrl, key, formData,
                file.slice((chunk - 1) * chunkSize, (chunk - 1) * chunkSize + chunkSize > file.size ?
                    file.size : (chunk - 1) * chunkSize + chunkSize))
            await fileApi.finishUploadChunk(md5, chunk)
        }
        await fileApi.finishSharding(md5)
    }
}
</script>

<template>
<Header/>
<NUpload ref="uploadRef" :show-file-list="false" :custom-request="upload">
    <n-button>上传文件</n-button>
</NUpload>
</template>

<style scoped lang="scss">

</style>