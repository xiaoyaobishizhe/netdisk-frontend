import {createRouter, createWebHistory} from "vue-router"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", redirect: "/home"},
        {
            path: "/login",
            component: () => import("@/views/login/index.vue"),
            children: [
                {path: "", component: () => import("@/views/login/login-panel.vue")}
            ]
        },
        {
            path: "/home",
            component: () => import("@/views/home/index.vue"),
            children: [
                {path: "", component: () => import("@/views/explorer/index.vue")},
                {path: "explorer", component: () => import("@/views/explorer/index.vue")}
            ]
        }
    ]
})

router.beforeEach((to, from) => {
    if (to.path === "/login") {
        return true
    } else {
        const token = localStorage.getItem("token")
        if (!token) {
            // TODO 在登录后跳转到之前的页面
            return "/login"
        }
    }
})

export default router