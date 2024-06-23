const setting = [
    {
        path: "",
        components: {
            default: () => import("@/subviews/userSetting.vue"),
        },
    },
    {
        path: "/language",
        name: "language",
        components: {
            default: () => import("@/subviews/language.vue"),
        },
    },
    
];

export default setting;
