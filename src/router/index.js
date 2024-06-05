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
        },
        {
            path: "/status",
            name: "status",
            component: () => import("@/views/statusView.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/loginView.vue"),
        },
        {
            path: "/retrieve",
            name: "retrieve",
            component: () => import("@/views/retrieveView.vue"),
        },
        {
            path: "/register",
            name: "register",
            component: () => import("@/views/registerView.vue"),
        },
        {
            path: "/404",
            name: "404",
            component: () => import("@/views/404View.vue"),
        },
        {
            path: "/:catchAll(.*)",
            redirect: "/404",
        },
    ],
});

export default router;
