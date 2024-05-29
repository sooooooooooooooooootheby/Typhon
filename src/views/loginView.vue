<template>
    <div class="loginAndRegister">
        <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#logo"></use>
            </svg>
        </div>
        <div class="panel" ref="panel">
            <p class="title">Welcome to</p>
            <p class="title">Typhon's Movie Party!</p>
            <form @submit.prevent="handleLogin">
                <div class="input">
                    <span>Username</span>
                    <input type="text" v-model="username" />
                </div>
                <div class="input">
                    <span>Password</span>
                    <input type="password" v-model="password" />
                </div>
                <button type="submit">Login</button>
            </form>
            <div class="register">
                <span>Get started with our app, <br />just <router-link to="/register">create an account</router-link> and enjoy the experience.</span>
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
        };
    },
    methods: {
        async getUserInfo() {
            try {
                await this.handleUser.getUserInfo({
                    username: this.username,
                });
            } catch(err) {
                console.log(err);
            }
        },
        async handleLogin() {
            if (this.username === null) {
                aotolog.log("用户名不能为空", "warn", this.logTimeout);
                return;
            }
            if (this.password === null) {
                aotolog.log("密码不能为空", "warn", this.logTimeout);
                return;
            }

            const salt = this.username + this.password + 'typhon';
            const hashPassword = CryptoJS.SHA256(salt).toString();
            try {
                await this.handleUser.login({
                    username: this.username,
                    password: hashPassword,
                });

                if (!this.handleUser.isLogin) {
                    aotolog.log(this.handleUser.message, "error", this.logTimeout);
                    return;
                }

                this.getUserInfo();
                this.handleUser.isLogin = false;
                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.$router.push("/");
            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/views/loginView.scss";
</style>
