import http from '@/utils/http'

function login(username, password) {
    return http.post('/user/login', {
        username,
        password
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export {
    login
}