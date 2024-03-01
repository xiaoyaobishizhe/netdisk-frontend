import http from "@/utils/http"

async function list() {
    const data = await http.get("/file/recycle-bin/list")
    return data.data.items
}

async function restore(ids) {
    await http.post("/file/recycle-bin/restore", {
        ids
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function remove(ids) {
    await http.post("/file/recycle-bin/remove", {
        ids
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function clear() {
    await http.post("/file/recycle-bin/clear", {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

export {
    list,
    restore,
    remove,
    clear
}