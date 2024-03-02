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

async function link(id) {
    const data = await http.get("/share/link", {
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

export {
    listShares,
    create,
    deleteShares,
    link,
    getUserId,
    getAccessToken
}