<script setup>
import {fileApi} from "@/apis"
import {fileToMd5} from "@/utils/file"

const uploadRef = ref(null)

const upload = async options => {
    const file = options.file.file
    uploadRef.value.clear()
    const md5 = await fileToMd5(file)
    const {chunkSize, currentChunk, totalChunk} = await fileApi.sharding(md5, file.name, file.size)

    console.log(chunkSize, currentChunk, totalChunk)
}


</script>

<template>
<NUpload ref="uploadRef" :show-file-list="false" :custom-request="upload">
    <n-button>上传文件</n-button>
</NUpload>
</template>

<style scoped lang="scss">

</style>