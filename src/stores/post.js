import { defineStore } from "pinia";
import axios from "axios";

export const postStore = defineStore({
    id: "post",
    state: () => {
        return {
            code: null,
            message: null,
            postList: [],
            postDetail: {},
            postCommentList: [],
        };
    },
    actions: {
        // 用户页获取用户文章
        async getUserPost(token, { username, page, pageSize }) {
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
        async getUserLike(token, { username, page, pageSize }) {
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
        // 获取文章数据
        async getPost({ token, page, pageSize }) {
            if (token) {
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

                    if (res.data.code === 0) {
                        this.code = res.data.code;
                        return (this.message = res.data.message);
                    }

                    this.postList = res.data.results;
                } catch (err) {
                    console.log(err);
                }
                return;
            }

            try {
                const res = await axios.get("/getPost");

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.postList = res.data.results;
            } catch (err) {
                console.log(err);
            }
        },
        // 点赞
        async like({ token, pid }) {
            try {
                const res = await axios.post(
                    "/like",
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
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 取消点赞
        async unlike({ token, pid }) {
            try {
                const res = await axios.post(
                    "/unlike",
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
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 文章详细页
        async getPostDetail({ token, pid }) {
            try {
                const res = await axios.get("/getPostDetail", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        pid,
                    },
                });

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.postDetail = res.data.results[0];
            } catch (err) {
                console.log(err);
            }
        },
        // 获取文章评论
        async getPostComment({ pid, page, pageSize }) {
            try {
                const res = await axios.get("/getPostComment", {
                    params: {
                        pid,
                        page,
                        pageSize,
                    },
                });

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.postCommentList = res.data.results;
            } catch (err) {
                console.log(err);
            }
        },
        // 发布文章评论
        async comment({ token, pid, content }) {
            try {
                const res = await axios.post(
                    "/comment",
                    {
                        pid,
                        content,
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
        // 发布文章
        async publishPost({ token, cover, content }) {
            try {
                const res = await axios.post(
                    "/publishPost",
                    {
                        cover,
                        content,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
    },
});
