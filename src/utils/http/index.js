import axios from "axios"
import {useRouter} from "vue-router"


const TOKEN_KEY = "token"

// JWT请求拦截器
function useJwtRequest(instance) {
    instance.interceptors.request.use(config => {
        let token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            config.headers[TOKEN_KEY] = token
        }
        return config
    }, err => {
        return Promise.reject(err)
    })
}

// JWT响应拦截器
function useJwtResponse(instance) {
    instance.interceptors.response.use(res => {
        let token = res.headers[TOKEN_KEY]
        if (token) {
            localStorage.setItem(TOKEN_KEY, token)
        }

        // if (res.data.code === 1006) {
        //     const router = useRouter()
        //     router.push("/login")
        // }
        return res
    }, err => {
        return Promise.reject(err)
    })
}

// 通用响应体拦截器
function useDataResponse(instance) {
    instance.interceptors.response.use(res => {
        if (res.data.code !== 200) {
            return Promise.reject(res.data)
        }
        return res.data
    }, err => {
        return Promise.reject(err)
    })
}

let instance = axios.create({
    baseURL: "http://localhost:9000",
    timeout: 10000
})

useJwtRequest(instance)

useJwtResponse(instance)
useDataResponse(instance)

export default instance