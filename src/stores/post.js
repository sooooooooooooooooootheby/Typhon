import { defineStore } from "pinia";
import axios from "axios";

export const postStore = defineStore({
    id: "post",
    state: () => {
        return {
            postItem: [],
            postList: [],
            message: null,
            comment: [],
        };
    },
    actions: {
        // 获取文章数据
        async getPost(token, { page, pageSize }) {
            try {
                const res = await axios.get("/getPost", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page,
                        pageSize,
                    },
                });
                this.postItem = res.data.results;
            } catch (error) {
                console.log(error);
            }
        },
        // 获取文章数据(未登录)
        async getPostNoLogin({ page, pageSize }) {
            try {
                const res = await axios.get("/getPostNoLogin", {
                    params: {
                        page,
                        pageSize,
                    },
                });
                this.postItem = res.data.results;
            } catch (error) {
                console.log(error);
            }
        },
        // 点赞
        async heart(token, { pid }) {
            try {
                const res = await axios.post(
                    "/heart",
                    {
                        pid,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.code === 0) {
                    this.message = res.data.message;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 取消点赞
        async noHeart(token, { pid }) {
            try {
                const res = await axios.post(
                    "/noHeart",
                    {
                        pid,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.code === 0) {
                    this.message = res.data.message;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 用户页获取用户文章
        async getUsersnamePost(token, { username, page, pageSize }) {
            try {
                const res = await axios.get("/getUserPost", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        username,
                        page,
                        pageSize,
                    },
                });
                this.postList = res.data.results;
            } catch (error) {
                console.log(error);
            }
        },
        // 用户页获取喜欢
        async getUsersnameLike(token, { username, page, pageSize }) {
            try {
                const res = await axios.get("/getUserLike", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        username,
                        page,
                        pageSize,
                    },
                });
                this.postList = res.data.results;
            } catch (error) {
                console.log(error);
            }
        },
        // 文章详细页
        async getDetailPost(token, { pid }) {
            try {
                const res = await axios.get("/getDetailPost", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        pid,
                    },
                });
                this.postItem = res.data.results[0];
            } catch (error) {
                console.log(error);
                this.message = error.response.data.message;
                setTimeout(() => {
                    this.message = null;
                }, 3000);
            }
        },
        // 获取评论
        async getComment(pid) {
            try {
                const res = await axios.get("/getComment", {
                    params: {
                        pid,
                    }
                });
                if (res.data.code === 0) {
                    this.message = res.data.message;
                    setTimeout(() => {
                        this.message = null;
                    }, 3000);
                    return;
                }
                this.comment = res.data.results;
            } catch (error) {
                this.message = error.response.data.message;
            }
        },
    },
});
