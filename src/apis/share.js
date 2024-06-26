import http from "@/utils/http"

async function listShares() {
    const data = await http.get("/share/list-share")
    return data.data.items
}

async function create(name, password, timeout, ids) {
    const data = await http.post("/share/create", {
        name,
        password,
        timeout,
        ids
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    return data.data
}

async function deleteShares(ids) {
    await http.post("/share/delete", {
        ids
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

async function linkInfo(id) {
    const data = await http.get("/share/link-info", {
        params: {
            id
        }
    })
    return data.data
}

async function getUserId(code) {
    const data = await http.get("/share/user-id", {
        params: {
            code
        }
    })
    return data.data
}

async function getAccessToken(code, password) {
    const data = await http.post("/share/access-token", {
        code,
        password
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    return data.data
}

async function list(token, parentId) {
    const data = await http.get("/share/list", {
        params: {
            token,
            parentId
        }
    })
    return data.data.files
}

async function save(token, ids, parentId) {
    await http.post("/share/save", {
        token,
        ids,
        parentId
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

export {
    listShares,
    create,
    deleteShares,
    linkInfo,
    getUserId,
    getAccessToken,
    list,
    save
}