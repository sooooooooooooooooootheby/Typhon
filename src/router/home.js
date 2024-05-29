const home = [
    {
        path: "",
        components: {
            default: () => import("@/subviews/postStream.vue"),
        },
    },
    {
        path: "/user/:username",
        props: true,
        components: {
            default: () => import("@/subviews/userPage.vue"),
        },
        beforeEnter: (ro, from, next) => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                next();
            } else {
                next("/login");
            }
        },
        children: [
            {
                path: "",
                components: {
                    default: () => import("@/subviews/userArticlePage.vue"),
                },
            },
            {
                path: "like",
                components: {
                    default: () => import("@/subviews/userLikePage.vue"),
                },
            },
        ],
    },
    {
        path: "/post/:pid",
        props: true,
        components: {
            default: () => import("@/subviews/postPage.vue"),
        },
    },
    {
        path: "/search",
        name: "search",
        component: () => import("@/subviews/searchPage.vue"),
    },
    {
        path: "/notifications",
        name: "notifications",
        component: () => import("@/subviews/notificationsPage.vue"),
    },
    {
        path: "/letter",
        name: "letter",
        component: () => import("@/subviews/letterPage.vue"),
    },
    {
        path: "/trok",
        name: "trok",
        component: () => import("@/subviews/trokPage.vue"),
    },
    {
        path: "/setting",
        name: "setting",
        component: () => import("@/subviews/settingPage.vue"),
    },
];

export default home;
