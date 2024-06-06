import { createRouter, createWebHistory } from "vue-router";
import home from "./home";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        {
            path: "/home",
            name: "home",
            component: () => import("@/views/homeView.vue"),
            children: [...home],
            meta: {
                title: "主页 | Typhon",
            },
        },
        {
            path: "/status",
            name: "status",
            component: () => import("@/views/statusView.vue"),
            meta: {
                title: "升级状态 | Typhon",
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/loginView.vue"),
            meta: {
                title: "登录你的账户 | Typhon",
            },
        },
        {
            path: "/retrieve",
            name: "retrieve",
            component: () => import("@/views/retrieveView.vue"),
            meta: {
                title: "找回密码 | Typhon",
            },
        },
        {
            path: "/register",
            name: "register",
            component: () => import("@/views/registerView.vue"),
            meta: {
                title: "注册你的账户 | Typhon",
            },
        },
        {
            path: "/404",
            name: "404",
            component: () => import("@/views/404View.vue"),
            meta: {
                title: "404 not found | Typhon",
            },
        },
        {
            path: "/:catchAll(.*)",
            redirect: "/404",
        },
    ],
});

export default router;
