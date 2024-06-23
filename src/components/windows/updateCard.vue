<template>
    <div class="bg" @click="this.$parent.cutEmailPanel()">
        <div class="writePanel" onclick="event.stopPropagation()">
            <div v-if="cardParameter === 'email'">
                <div>
                    <div class="iconBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#mail"></use>
                        </svg>
                    </div>
                    <span>{{ $t("user.window.email.title") }}</span>
                </div>
                <label>
                    <span>{{ $t("user.window.email.span1") }}</span>
                    <input type="text" v-model="email" />
                </label>
                <label>
                    <span>{{ $t("user.window.email.span2") }}</span>
                    <div class="code">
                        <input type="text" v-model="code" />
                        <button @click="sendEmail">{{ $t(time) }}</button>
                    </div>
                </label>
                <button class="submit" @click="handleUpdateEmail">{{ $t("user.window.email.button") }}</button>
            </div>
            <div v-if="cardParameter === 'password'">
                <div>
                    <div class="iconBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#password"></use>
                        </svg>
                    </div>
                    <span>{{ $t("user.window.password.title") }}</span>
                </div>
                <label>
                    <span>{{ $t("user.window.password.span1") }}</span>
                    <div class="password">
                        <input :type="inputValue1" v-model="oldPassword" />
                        <button type="button" @click="showPassword(1)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="hrefValue1"></use>
                            </svg>
                        </button>
                    </div>
                </label>
                <label>
                    <span>{{ $t("user.window.password.span2") }}</span>
                    <div class="password">
                        <input :type="inputValue2" v-model="newPassword1" />
                        <button type="button" @click="showPassword(2)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="hrefValue2"></use>
                            </svg>
                        </button>
                    </div>
                </label>
                <label>
                    <span>{{ $t("user.window.password.span3") }}</span>
                    <div class="password">
                        <input :type="inputValue3" v-model="newPassword2" />
                        <button type="button" @click="showPassword(3)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="hrefValue3"></use>
                            </svg>
                        </button>
                    </div>
                </label>
                <button class="submit" @click="handleUpdatePassword">{{ $t("user.window.password.button") }}</button>
            </div>
            <div v-if="cardParameter === 'deleteUser'">
                <div>
                    <div class="iconBox red">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#delete"></use>
                        </svg>
                    </div>
                    <span>{{ $t("user.window.delete.title") }}</span>
                </div>
                <label>
                    <span>{{ $t("user.window.delete.span1") }}</span>
                    <input type="text" v-model="email" />
                </label>
                <label>
                    <span>{{ $t("user.window.delete.span2") }}</span>
                    <div class="password">
                        <input :type="inputValue3" v-model="password" />
                        <button type="button" @click="showPassword(3)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="hrefValue3"></use>
                            </svg>
                        </button>
                    </div>
                </label>
                <button class="submit" @click="handleDeleteUser">{{ $t("user.window.delete.button") }}</button>
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
            time: "user.window.time",
            timeDown: 0,
            oldPassword: null,
            newPassword1: null,
            newPassword2: null,
            password: null,
            inputValue1: "password",
            inputValue2: "password",
            inputValue3: "password",
            hrefValue1: "#eye-open",
            hrefValue2: "#eye-open",
            hrefValue3: "#eye-open",
            isEye1: true,
            isEye2: true,
            isEye3: true,
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
                    this.time = "user.window.time";
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
        // 显示密码
        showPassword(key) {
            let inputValue;
            switch (key) {
                case 1:
                    if (this.isEye1) {
                        this.hrefValue1 = "#eye-closed";
                        this.inputValue1 = "text";
                        this.isEye1 = false;
                    } else {
                        this.hrefValue1 = "#eye-open";
                        this.inputValue1 = "password";
                        this.isEye1 = true;
                    }
                    break;
                case 2:
                    if (this.isEye2) {
                        this.hrefValue2 = "#eye-closed";
                        this.inputValue2 = "text";
                        this.isEye2 = false;
                    } else {
                        this.hrefValue2 = "#eye-open";
                        this.inputValue2 = "password";
                        this.isEye2 = true;
                    }
                    break;
                case 3:
                    if (this.isEye3) {
                        this.hrefValue3 = "#eye-closed";
                        this.inputValue3 = "text";
                        this.isEye3 = false;
                    } else {
                        this.hrefValue3 = "#eye-open";
                        this.inputValue3 = "password";
                        this.isEye3 = true;
                    }
                    break;
                default:
                    break;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/windows/updateCard.scss";
</style>
