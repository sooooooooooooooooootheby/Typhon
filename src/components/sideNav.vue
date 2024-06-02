<template>
    <header class="sideNav">
        <div class="logoBox">
            <router-link to="/">
                <svg class="icon logo" aria-hidden="true">
                    <use xlink:href="#logo"></use>
                </svg>
            </router-link>
        </div>
        <nav>
            <ul>
                <router-link to="/home" class="default" :class="{ select: isHome }">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#home"></use>
                    </svg>
                    <li class="text">主页</li>
                </router-link>

                <router-link to="/search" class="default" :class="{ select: isSearch }" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#search"></use>
                    </svg>
                    <li class="text">探索</li>
                </router-link>

                <router-link to="/notifications" class="default" :class="{ select: isNotifications }" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#notifications"></use>
                    </svg>
                    <li class="text">通知</li>
                </router-link>

                <router-link to="/letter" class="default" :class="{ select: isLetter }" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#mail"></use>
                    </svg>
                    <li class="text">私信</li>
                </router-link>

                <router-link to="/trok" class="default" :class="{ select: isTrok }" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#Trok"></use>
                    </svg>
                    <li class="text">Trok</li>
                </router-link>

                <router-link to="/status" class="default" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#Pro"></use>
                    </svg>
                    <li class="text">Pro</li>
                </router-link>

                <router-link :to="/user/ + handleUser.userInfo.username" class="default" :class="{ select: isUser }" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#user-circle"></use>
                    </svg>
                    <li class="text">个人资料</li>
                </router-link>

                <router-link to="/setting" class="default" :class="{ select: isSetting }">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#setting"></use>
                    </svg>
                    <li class="text">设置</li>
                </router-link>

                <button @click="this.$parent.cutWritePanel()" v-if="isLogin">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#pen"></use>
                    </svg>
                    发帖
                </button>
            </ul>
        </nav>
        <div class="user" v-if="isLogin" @click="animateElement">
            <div class="logout" ref="logout">
                <a @click="handleLogout">登出 @{{ handleUser.userInfo.name }}</a>
            </div>
            <div class="head">
                <img :src="handleUser.userInfo.head" alt="" />
            </div>
            <div class="text">
                <span>{{ handleUser.userInfo.name }}</span>
                <p>@{{ handleUser.userInfo.username }}</p>
            </div>
        </div>
    </header>
</template>

<script>
import { userStore } from "@/stores/user.js";
import { gsap } from "gsap";
import router from "@/router";

export default {
    data() {
        const user = userStore();
        return {
            handleUser: user,
            isHome: false,
            isSearch: false,
            isNotifications: false,
            isLetter: false,
            isTrok: false,
            isUser: false,
            isSetting: false,
            isLogin: true,
            accessToken: localStorage.getItem("accessToken")
        };
    },
    methods: {
        animateElement() {
            if (this.isLogin) {
                if (this.isShowLoginout) {
                    gsap.to(this.$refs.logout, {
                        duration: 0.6,
                        y: 0,
                        opacity: 0,
                        zIndex: -99,
                        ease: "back.out",
                    });
                    this.isShowLoginout = false;
                } else {
                    gsap.to(this.$refs.logout, {
                        duration: 0.4,
                        y: -70,
                        opacity: 1,
                        zIndex: 99,
                        ease: "back.out",
                    });
                    this.isShowLoginout = true;
                }
            }
        },
        async handleLogout() {
            try {
                await this.handleUser.logout({ token: this.accessToken });
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                this.isLogin = false;
                router.push("/login");
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        if (localStorage.getItem("accessToken")) {
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }
    },
    watch: {
        "$route.path": {
            handler(newPath) {
                this.isHome = /^\/home$/.test(newPath);
                this.isSearch = /^\/search$/.test(newPath);
                this.isNotifications = /^\/notifications$/.test(newPath);
                this.isLetter = /^\/letter$/.test(newPath);
                this.isTrok = /^\/trok$/.test(newPath);
                this.isUser = /^\/user\/.*$/.test(newPath);
                this.isSetting = /^\/setting$/.test(newPath);
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/sideNav.scss";
</style>
