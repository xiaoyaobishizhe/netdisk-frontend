import {defineStore} from "pinia"
import {userApi} from "@/apis"

export default defineStore("user", {
    state: () => ({
        userInfo: {}
    }),
    actions: {
        async fetchUserInfo() {
            this.userInfo = await userApi.info()
        }
    }
})