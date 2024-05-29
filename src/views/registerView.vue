<template>
    <div class="loginAndRegister">
        <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#logo"></use>
            </svg>
        </div>
        <div class="panel" ref="panel">
            <!-- <p class="title">Let's have</p> -->
            <!-- <p class="title">a party then!</p> -->
            <form @submit.prevent="handleRegister">
                <div class="input">
                    <span>Email</span>
                    <input type="email" v-model="email" />
                </div>
                <div class="code">
                    <span>code</span>
                    <div>
                        <input type="text" v-model="code" />
                        <button type="button" @click="handleGyro" ref="gyro">Gyro</button>
                        <button type="button" @click="sendEmail">{{ time }}</button>
                    </div>
                </div>
                <div class="input">
                    <div class="usernameHint" ref="usernameHint">username在注册后将无法修改</div>
                    <span>Username <a @click="showUsernameHint">(?)</a></span>
                    <input type="text" v-model="username" />
                </div>
                <div class="input">
                    <span>Password</span>
                    <input type="password" v-model="password" />
                </div>
                <button type="submit">Register</button>
            </form>
            <div class="register">
                <span>Already have an account? <router-link to="/login">Direct login</router-link></span>
            </div>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import { emailStore } from "@/stores/email.js";
import aotolog from "autolog.js";
import { gsap } from "gsap";
import CryptoJS from "crypto-js";

export default {
    data() {
        const user = userStore();
        const email = emailStore();
        return {
            handleUser: user,
            handleEmail: email,
            email: null,
            code: null,
            username: null,
            password: null,
            logTimeout: 6000,
            gyro: false,
            text: 0,
            X: 0,
            Y: 0,
            Z: 0,
            time: "send",
            timeDown: 0,
        };
    },
    methods: {
        showUsernameHint() {
            let tl = gsap.timeline();
            tl.to(this.$refs.usernameHint, {
                duration: 0.6,
                y: -35,
                opacity: 1,
                zIndex: 99,
                ease: "back.out",
            });
            tl.to(this.$refs.usernameHint, {
                duration: 0.6,
                y: 0,
                opacity: 0,
                zIndex: -99,
                ease: "back.out",
                delay: 3,
            });
        },
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
                await this.handleEmail.email({
                    email: this.email,
                });

                if (!this.handleEmail.isSend) {
                    aotolog.log(this.handleEmail.message, "error", this.logTimeout);
                    return;
                }

                this.startTimedown();
                aotolog.log(this.handleEmail.message, "success", this.logTimeout);
            } catch (err) {
                console.log(err);
            }
        },
        generateRandomString(length) {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        async handleRegister() {
            if (this.email === null) {
                aotolog.log("邮箱不能为空", "warn", this.logTimeout);
                return;
            }
            if (this.code === null) {
                aotolog.log("验证码不能为空", "warn", this.logTimeout);
                return;
            }
            if (this.username === null) {
                aotolog.log("用户名不能为空", "warn", this.logTimeout);
                return;
            }
            if (this.password === null) {
                aotolog.log("密码不能为空", "warn", this.logTimeout);
                return;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(this.password)) {
                aotolog.log("密码必须至少包含一个小写字母、一个大写字母和一个数字，且长度为8-20位", "error", this.logTimeout);
                return;
            }

            const salt = this.username + this.password + 'typhon';
            const hashPassword = CryptoJS.SHA256(salt).toString();
            try {
                await this.handleUser.register({
                    email: this.email,
                    code: this.code,
                    username: this.username,
                    password: hashPassword,
                });

                if (!this.handleUser.isRegister) {
                    aotolog.log(this.handleUser.message, "error", this.logTimeout);
                    return;
                }

                this.handleUser.isRegister = false;
                aotolog.log(this.handleUser.message, "success", this.logTimeout);
                this.$router.push("/login");
            } catch (err) {
                console.log(err);
            }
        },
        // 检查并请求陀螺仪权限的函数
        async allowOrientation() {
            let flag;
            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                try {
                    await DeviceOrientationEvent.requestPermission().then((permissionState) => {
                        flag = permissionState === "granted";
                    });
                } catch (e) {
                    flag = false;
                }
            } else {
                flag = true;
            }
            if (flag) {
                alert("陀螺仪权限获取成功，功能正常使用");
            } else {
                alert("陀螺仪权限获取失败，功能无法使用");
            }
        },
        // 处理陀螺仪更新的函数
        updateGravity(event) {
            this.X = Math.floor(event.alpha);
            this.Y = Math.floor(event.beta);
            this.Z = Math.floor(event.gamma);
            // 计算验证码
            this.text = this.X * this.Y * this.Z;
        },
        handleGyro() {
            if (!this.gyro) {
                this.gyro = true;
                this.$refs.gyro.style.backgroundColor = "#ffffff";
                this.$refs.gyro.style.color = "#1B1B1B";
                this.allowOrientation();
                window.addEventListener("deviceorientation", this.updateGravity, false);
            } else {
                this.gyro = false;
                this.$refs.gyro.style.backgroundColor = "#1B1B1B";
                this.$refs.gyro.style.color = "#FFFFFF";
                window.removeEventListener("deviceorientation", this.updateGravity, false);
            }
        },
    },
    watch: {
        // 更新陀螺仪输入的数据
        text(newText, oldText) {
            this.code = this.text;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/views/registerView.scss";
</style>
