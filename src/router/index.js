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
                {path: "", component: () => import("@/views/home/explorer/index.vue")},
                {path: "explorer", component: () => import("@/views/home/explorer/index.vue")},
                {path: "recycle-bin", component: () => import("@/views/home/recycle-bin/index.vue")},
                {path: "share", component: () => import("@/views/home/share/index.vue")}
            ]
        },
        {
            name: "share",
            path: "/s/:code([0-9a-zA-Z]{30})",
            component: () => import("@/views/share/index.vue")
        },
        {
            name: "shareInit",
            path: "/share/init",
            component: () => import("@/views/share-init/index.vue"),
        },
        {path: '/:pathMatch(.*)', redirect: '/404'},
        {path: '/404', component: () => import("@/views/404/index.vue")}
    ]
})

router.beforeEach((to, from) => {
    // /share/init路径必须要带上code查询参数，否则跳转到404页面。
    if (to.name === "shareInit") {
        if ("code" in to.query) {
            return true
        } else {
            return "/404"
        }
    }

    if (to.name === "share") {
        const token = localStorage.getItem(`access-token:${to.params.code}`)
        if (token) {
            return true
        } else {
            return `/share/init?code=${to.params.code}${("pwd" in to.query) ? "&pwd=" + to.query.pwd : ""}`
        }
    }

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