<template>
    <div class="loginAndRegister">
        <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#logo"></use>
            </svg>
        </div>
        <div class="panel" ref="panel">
            <form @submit.prevent="handleRetrieve" v-if="isCode">
                <div class="input">
                    <span>Your username & email</span>
                    <input type="text" v-model="retrieve" />
                </div>
                <button type="submit">下一个</button>
            </form>
            <form @submit.prevent="handleSetPassword" v-else>
                {{ handleUser.message }}
                <div class="input">
                    <span>Your email code</span>
                    <input type="text" v-model="code" />
                    <span>new password</span>
                    <div class="password">
                        <input :type="inputValue" v-model="password" />
                        <button type="button" @click="showPassword">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="hrefValue"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="submit">提交</button>
            </form>
            <div class="retrieve">
                <router-link to="/login">想起密码？</router-link>
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
            isCode: true,
            retrieve: null,
            code: null,
            password: null,
            inputValue: "password",
            hrefValue: "#eye-open",
            isEye: true,
        };
    },
    methods: {
        // 处理查询用户名或邮箱
        async handleRetrieve() {
            if (this.retrieve === null) {
                return aotolog.log("用户名 & 邮箱不能为空", "warn", this.logTimeout);
            }

            const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!usernameRegex.test(this.retrieve) && !emailRegex.test(this.retrieve)) {
                return aotolog.log("格式错误", "warn", this.logTimeout);
            }

            try {
                await this.handleUser.selectUsernameEmail({ retrieve: this.retrieve });

                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", this.logTimeout);
                }

                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.isCode = false;
            } catch (err) {
                console.log(err);
            }
        },
        // 处理设置新密码
        async handleSetPassword() {
            if (this.code === null || this.password === null) {
                return aotolog.log("验证码 & 密码不能为空", "warn", this.logTimeout);
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(this.password)) {
                return aotolog.log("密码必须至少包含一个小写字母、一个大写字母和一个数字，且长度为8-20位", "error", this.logTimeout);
            }

            // 密码哈希加密
            const hashPassword = CryptoJS.SHA256(this.password).toString();
            try {
                await this.handleUser.setPassword({ retrieve: this.retrieve, code: this.code, password: hashPassword });

                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", this.logTimeout);
                }

                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.$router.push("/login");
            } catch (err) {
                console.log(err);
            }
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
