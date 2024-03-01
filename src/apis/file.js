import http from "@/utils/http"

async function sharding(identifier, filename, size, parentId) {
    const data = await http.put("/file/sharding", {
        identifier,
        filename,
        size,
        parentId
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    return {
        chunkSize: data.data.chunkSize,
        currentChunk: data.data.currentChunk,
        totalChunk: data.data.totalChunk,
        canSecUpload: data.data.canSecUpload,
        existSameFile: data.data.existSameFile
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
        formData: {
            "x-amz-algorithm": data.data.formData["x-amz-algorithm"],
            "x-amz-credential": data.data.formData["x-amz-credential"],
            "x-amz-date": data.data.formData["x-amz-date"],
            "x-amz-signature": data.data.formData["x-amz-signature"],
            policy: data.data.formData.policy
        },
        uploadUrl: data.data.uploadUrl
    }
}

async function uploadChunk(url, key, formData, blob) {
    formData.key = key
    formData.file = blob
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

async function listFiles(parentId) {
    const params = {}
    if (parentId) {
        params.parentId = parentId
    }
    const data = await http.get("/file/list", {
        params
    })
    return data.data.files
}

async function listFolders(parentId) {
    const params = {}
    if (parentId) {
        params.parentId = parentId
    }
    const data = await http.get("/file/list-folder", {
        params
    })
    return data.data.folders
}

async function copy(ids, parentId) {
    await http.post("/file/copy", {
        ids,
        parentId
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function move(ids, parentId) {
    await http.post("/file/move", {
        ids,
        parentId
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function deleteFile(ids) {
    await http.post("/file/delete", {
        ids
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function createFolder(parentId, folderName) {
    await http.put("/file/folder", {
        parentId,
        folderName
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
    finishSharding,
    listFiles,
    createFolder,
    listFolders,
    copy,
    move,
    deleteFile
}