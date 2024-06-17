<template>
    <div class="bg" @click="this.$parent.cutEmailPanel()">
        <div class="writePanel" onclick="event.stopPropagation()">
            <div class="email" v-if="cardParameter === 'email'">
                <span>修改你的邮箱</span>
                <label>新的邮箱<input type="text" v-model="email" /></label>
                <label>
                    邮箱验证码
                    <input type="text" v-model="code" />
                    <button @click="sendEmail">{{ time }}</button>
                </label>
                <button @click="handleUpdateEmail">提交</button>
            </div>
            <div class="email" v-if="cardParameter === 'password'">
                <span>修改你的密码</span>
                <label>旧的密码<input type="password" v-model="oldPassword" /></label>
                <label>新的密码<input type="password" v-model="newPassword1" /></label>
                <label>再次输入新的密码<input type="password" v-model="newPassword2" /></label>
                <button @click="handleUpdatePassword">提交</button>
            </div>
            <div class="email" v-if="cardParameter === 'deleteUser'">
                <span>注销你的账户</span>
                <label>邮箱<input type="text" v-model="email" /></label>
                <label>密码<input type="password" v-model="password" /></label>
                <button @click="handleDeleteUser">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import { emailStore } from "@/stores/email.js";
import aotolog from "autolog.js";
import CryptoJS from "crypto-js";

export default {
    props: ["cardParameter"],
    data() {
        const user = userStore();
        const email = emailStore();
        return {
            handleUser: user,
            handleEmail: email,
            token: localStorage.getItem("accessToken"),
            email: null,
            code: null,
            time: "send",
            timeDown: 0,
            oldPassword: null,
            newPassword1: null,
            newPassword2: null,
            password: null,
        };
    },
    methods: {
        // 倒计时
        startTimedown() {
            this.timeDown = 60;
            const timer = setInterval(() => {
                if (this.timeDown > 0) {
                    this.timeDown--;
                    this.time = this.timeDown;
                } else {
                    this.time = "send";
                    clearInterval(timer);
                }
            }, 1000);
        },
        // 发送验证码
        async sendEmail() {
            if (this.email === null) {
                aotolog.log("邮箱不能为空", "warn", this.logTimeout);
                return;
            }
            if (this.timeDown > 0) {
                aotolog.log("倒计时结束前请勿重复发送", "warn", this.logTimeout);
                return;
            }
            try {
                await this.handleEmail.sendEmail({
                    email: this.email,
                });

                if (this.handleEmail.code === 0) {
                    aotolog.log(this.handleEmail.message, "error", this.logTimeout);
                    return;
                }

                this.startTimedown();
                aotolog.log(this.handleEmail.message, "success", this.logTimeout);
            } catch (err) {
                console.log(err);
            }
        },
        // 发送修改邮箱请求
        async handleUpdateEmail() {
            if (this.email === null) {
                return aotolog.log("邮箱不能为空", "warn", this.logTimeout);
            }
            if (this.code === null) {
                return aotolog.log("验证码不能为空", "warn", this.logTimeout);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return aotolog.log("邮箱格式错误", "warn", this.logTimeout);
            }
            const passwordRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!passwordRegex.test(password)) {
                return aotolog.log("密码格式错误", "warn", this.logTimeout);
            }

            try {
                await this.handleUser.updateEmail({
                    token: this.token,
                    email: this.email,
                    code: this.code,
                });

                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", this.logTimeout);
                }

                this.handleUser.code = null;
                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.$parent.cutEmailPanel();
            } catch (err) {
                console.log(err);
            }
        },
        // 发起更新密码请求
        async handleUpdatePassword() {
            if (this.oldPassword === null) {
                return aotolog.log("旧密码不能为空", "warn", this.logTimeout);
            }
            if (this.newPassword1 === null) {
                return aotolog.log("新密码不能为空", "warn", this.logTimeout);
            }
            if (this.newPassword2 === null) {
                return aotolog.log("请再次输入新密码", "warn", this.logTimeout);
            }
            if (this.newPassword1 != this.newPassword2) {
                return aotolog.log("第二次输入的密码和第一次不同", "warn", this.logTimeout);
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(this.newPassword1)) {
                return aotolog.log("密码格式错误", "warn", this.logTimeout);
            }

            // 密码哈希加密
            const hashOldPassword = CryptoJS.SHA256(this.oldPassword).toString();
            const hashNewPassword = CryptoJS.SHA256(this.newPassword1).toString();

            try {
                await this.handleUser.updatePassword({
                    token: this.token,
                    oldPassword: hashOldPassword,
                    newPassword: hashNewPassword,
                });

                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", this.logTimeout);
                }

                this.handleUser.code = null;
                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.$parent.cutEmailPanel();
            } catch (err) {
                console.log(err);
            }
        },
        // 发起注销账户请求
        async handleDeleteUser() {
            if (this.email === null) {
                return aotolog.log("邮箱不能为空", "warn", this.logTimeout);
            }
            if (this.password === null) {
                return aotolog.log("密码不能为空", "warn", this.logTimeout);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                return aotolog.log("邮箱格式错误", "warn", this.logTimeout);
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(this.password)) {
                return aotolog.log("密码格式错误", "warn", this.logTimeout);
            }

            // 密码哈希加密
            const hashPassword = CryptoJS.SHA256(this.password).toString();

            try {
                await this.handleUser.deleteUser({
                    token: this.token,
                    email: this.email,
                    password: hashPassword,
                });

                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", this.logTimeout);
                }

                this.handleUser.code = null;
                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/login");
            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/windows/updateCard.scss";
</style>
