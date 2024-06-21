<template>
    <div class="loginAndRegister">
        <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#logo"></use>
            </svg>
        </div>
        <div class="panel" ref="panel">
            <p class="title">Welcome</p>
            <span class="subTitle">Join in</span>
            <form @submit.prevent="handleLogin" v-if="isRetrieve">
                <div class="input">
                    <span>Username</span>
                    <input type="text" v-model="username" />
                </div>
                <div class="input">
                    <span>Password</span>
                    <div class="password">
                        <input :type="inputValue" v-model="password" />
                        <button type="button" @click="showPassword">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="hrefValue"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="submit">登录</button>
            </form>
            <div class="retrieve">
                <router-link to="/retrieve">忘记密码？</router-link>
            </div>
            <div class="register" v-if="isRetrieve">
                <span>初来乍到？<router-link to="/register">创建账户</router-link>加入我们！</span>
            </div>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import aotolog from "autolog.js";
import CryptoJS from "crypto-js";

export default {
    data() {
        const user = userStore();
        return {
            handleUser: user,
            username: null,
            password: null,
            logTimeout: 3000,
            isRetrieve: true,
            retrieve: null,
            retrieveText: "忘记密码?",
            isCode: false,
            inputValue: "password",
            hrefValue: "#eye-open",
            isEye: true,
        };
    },
    methods: {
        // 获取用户信息
        async getUserInfo() {
            try {
                await this.handleUser.getUserInfo({
                    username: this.username,
                });
            } catch (err) {
                console.log(err);
            }
        },
        // 处理登录
        async handleLogin() {
            if (this.username === null) {
                return aotolog.log("用户名不能为空", "warn", this.logTimeout);
            }
            if (this.password === null) {
                return aotolog.log("密码不能为空", "warn", this.logTimeout);
            }

            const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
            if (!usernameRegex.test(this.username)) {
                return aotolog.log("用户名格式错误", "warn", this.logTimeout);
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(this.password)) {
                return aotolog.log("密码格式错误", "warn", this.logTimeout);
            }

            // 密码哈希加密
            const hashPassword = CryptoJS.SHA256(this.password).toString();
            try {
                await this.handleUser.login({
                    username: this.username,
                    password: hashPassword,
                });

                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", this.logTimeout);
                }

                this.getUserInfo();
                this.handleUser.code = null;
                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.$router.push("/");
            } catch (err) {
                console.log(err);
            }
        },
        // 忘记密码页面切换
        cutRetrieve() {
            if (this.isRetrieve) {
                this.isRetrieve = false;
                this.retrieveText = "想起密码了!";
                return;
            }
            this.isRetrieve = true;
            this.retrieveText = "忘记密码?";
        },
        // 显示密码
        showPassword() {
            if (this.isEye) {
                this.hrefValue = "#eye-closed";
                this.inputValue = "text";
                this.isEye = false;
            } else {
                this.hrefValue = "#eye-open";
                this.inputValue = "password";
                this.isEye = true;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/views/loginView.scss";
</style>
