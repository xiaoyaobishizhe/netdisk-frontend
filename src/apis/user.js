import http from '@/utils/http'

async function login(username, password) {
    return await http.post('/user/login', {
        username,
        password
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

async function info() {
    return await http.get('/user')
}

export {
    login,
    info
}