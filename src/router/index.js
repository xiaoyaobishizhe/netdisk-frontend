import {createRouter, createWebHistory} from "vue-router"

export default createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", redirect: "/login"},
        {
            path: "/login",
            component: () => import("@/views/login/index.vue"),
            children: [
                {path: "", component: () => import("@/views/login/LoginPanel.vue")}
            ]
        }
    ]
})