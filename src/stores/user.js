import { defineStore } from "pinia";
import axios from "axios";

export const userStore = defineStore({
    id: "user",
    state: () => {
        return {
            message: null,
            code: null,
            userInfo: {},
            usersInfo: {},
            newUser: [],
        };
    },
    actions: {
        // 注册
        async register({ email, code, username, password }) {
            try {
                const res = await axios.post("/register", { email, code, username, password });
                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }
                this.code = res.data.code;
                this.message = res.data.message;
            } catch (err) {
                this.message = err.response.data.message;
            }
        },
        // 登录
        async login({ username, password }) {
            try {
                const res = await axios.post("/login", { username, password });
                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }
                this.code = res.data.code;
                this.message = res.data.message;
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
            } catch (err) {
                this.message = err.response.data.message;
            }
        },
        // 获取用户信息
        async getUserInfo({ token, username }) {
            if (token) {
                try {
                    const res = await axios.get("/getUserInfo", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (res.data.code === 0) {
                        this.code = res.data.code;
                        return (this.message = res.data.message);
                    }
                    this.code = res.data.code;
                    this.userInfo = res.data.results[0];
                } catch (err) {
                    console.log(err);
                }
                return;
            }
            if (username) {
                try {
                    const res = await axios.get("/getUserInfo", {
                        params: {
                            username,
                        },
                    });
                    if (res.data.code === 0) {
                        this.code = res.data.code;
                        return (this.message = res.data.message);
                    }
                    this.code = res.data.code;
                    this.usersInfo = res.data.results[0];
                } catch (err) {
                    console.log(err);
                }
                return;
            }
        },
        // 更新accessToken
        async updateAccessToken({ refreshToken }) {
            try {
                const res = await axios.post("/updateAccessToken", { refreshToken });
                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.newRefreshToken);
            } catch (err) {
                console.log(err);
            }
        },
        // 获取新注册的用户
        async getNewUser() {
            try {
                const res = await axios.get("/getNewUser");

                this.newUser = res.data.results;
            } catch (err) {
                console.log(err);
            }
        },
        // 升级状态
        async updateStatus({ token, status }) {
            try {
                const res = await axios.post(
                    "/updateStatus",
                    {
                        status,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
        // 登出
        async logout({ token }) {
            try {
                const res = await axios.post(
                    "/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (err) {
                console.log(err);
            }
        },
        // 更新用户信息
        async updateUserInfo({ token, background_image, head, name, introduction, place, website }) {
            try {
                const res = await axios.post(
                    "/updateUserInfo",
                    { background_image, head, name, introduction, place, website },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
        // 查询用户名和邮箱是否存在
        async selectUsernameEmail({ retrieve }) {
            try {
                const res = await axios.get("/selectUsernameEmail", {
                    params: {
                        retrieve,
                    },
                });

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.code = res.data.code;
                this.message = res.data.hint;
            } catch (err) {
                console.log(err);
            }
        },
        // 找回密码
        async setPassword({ retrieve, code, password }) {
            try {
                const res = await axios.post("/setPassword", {
                    retrieve,
                    code,
                    password,
                });

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.code = res.data.code;
                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
        // 更新邮箱
        async updateEmail({ token, email, code }) {
            try {
                const res = await axios.post(
                    "/updateEmail",
                    { email, code },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.code = res.data.code;
                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
        // 更新密码
        async updatePassword({ token, oldPassword, newPassword }) {
            try {
                const res = await axios.post(
                    "/updatePassword",
                    { oldPassword, newPassword },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.code = res.data.code;
                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
        // 注销账户
        async deleteUser({ token, email, password }) {
            try {
                const res = await axios.post(
                    "/deleteUser",
                    { email, password },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.code = res.data.code;
                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        }
    },
});
