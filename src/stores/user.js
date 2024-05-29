import { defineStore } from "pinia";
import axios from "axios";

export const userStore = defineStore({
    id: "user",
    state: () => {
        return {
            message: null,
            isLogin: false,
            userInfo: {},
            usersInfo: {},
            isRegister: false,
            code: null,
        };
    },
    actions: {
        // 登录
        async login({ username, password }) {
            try {
                const res = await axios.post("/login", { username, password });
                if (res.data.code === 0) {
                    this.message = res.data.message;
                    return;
                }
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                this.message = res.data.message;
                this.isLogin = true;
            } catch (error) {
                if (error.response) {
                    this.message = error.response.data.message;
                }
            }
        },
        // 获取用户信息
        async getUserInfo({ username }) {
            try {
                const res = await axios.get("/getUserInfo", { params: { username } });
                if (res.data.code === 0) {
                    this.message = res.data.message;
                    return;
                }
                this.usersInfo = res.data;
            } catch (error) {
                if (error.response) {
                    this.message = error.response.data.message;
                }
            }
        },
        async getTokenUserInfo(token) {
            try {
                const res = await axios.get("/getTokenUserInfo", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.userInfo = res.data;
            } catch (error) {
                if (error.response) {
                    this.message = error.response.data.message;
                }
            }
        },
        // 注册
        async register({ email, code, username, password }) {
            try {
                const res = await axios.post("/register", { email, code, username, password });
                if (res.data.code === 0) {
                    this.message = res.data.message;
                    return;
                }
                this.message = res.data.message;
                this.isRegister = true;
            } catch (error) {
                if (error.response) {
                    this.message = error.response.data.message;
                }
            }
        },
        // 请求accessToken
        async getAccessToken(refreshToken) {
            try {
                const res = await axios.get("/getAccessToken", { params: { refreshToken } });
                if (res.data.code === 1) {
                    this.code = res.data.code;
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    return;
                }
                if (res.data.code === 2) {
                    this.code = res.data.code;
                    return;
                }
            } catch (error) {
                if (error.response) {
                    this.message = error.response.data.message;
                }
            }
        },
        // 登出
        async logout(uid) {
            try {
                const res = await axios.post("/logout", { uid });
            } catch (error) {
                if (error.response) {
                    this.message = error.response.data.message;
                }
            }
        },
        // 获取新用户
        async getNewUser() {
            try {
                const res = await axios.get("/newUser");
                this.newUser = res.data.results;
            } catch (error) {
                this.message = error.response.data.message;
            }
        },
        // 升级身份
        async status({ uid, status }) {
            try {
                const res = await axios.post("/status", { uid, status });
                this.message = res.data;
            } catch (error) {
                this.message = error.response.data.message;
            }
        },
    },
});
