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

export {
    sharding
}