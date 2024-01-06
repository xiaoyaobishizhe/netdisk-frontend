import http from "@/utils/http"

async function sharding(identifier, filename, size) {
    const data = await http.put("/file/sharding", {
        identifier,
        filename,
        size
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    return {
        chunkSize: data.data.chunkSize,
        currentChunk: data.data.currentChunk,
        totalChunk: data.data.totalChunk
    }
}

async function applyUploadChunk(identifier, chunkNumber) {
    const data = await http.post("/file/apply-upload-chunk", {
        identifier,
        chunkNumber
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    return {
        key: data.data.key,
        formData: data.data.formData,
        uploadUrl: data.data.uploadUrl
    }
}

async function uploadChunk(url, key, formData, fileType, blob) {
    formData.key = key
    formData.file = blob
    formData["Content-Type"] = fileType
    try {
        await http.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    } catch (e) {
        // ignore
    }
}

async function finishUploadChunk(identifier, chunkNumber) {
    return await http.post("/file/upload-chunk", {
        identifier,
        chunkNumber
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function finishSharding(identifier) {
    return await http.post("/file/finish-upload-chunk", {
        identifier
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

export {
    sharding,
    applyUploadChunk,
    uploadChunk,
    finishUploadChunk,
    finishSharding
}