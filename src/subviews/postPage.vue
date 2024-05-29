<template>
    <topNav :title="topNavTitle" :show="show" />
    <div class="postPage">
        <div class="post">
            <div class="author">
                <router-link :to="/user/ + handlePost.postItem.username">
                    <img :src="handlePost.postItem.head" alt="" />
                    <div class="text">
                        <span>{{ handlePost.postItem.name }}</span>
                        <p>@{{ handlePost.postItem.username }}</p>
                    </div>
                </router-link>
            </div>

            <blockquote class="content">
                <p v-html="compiledMarkdown"></p>
            </blockquote>

            <div class="cover" :class="{ landscape: isLandscape, portrait: isPortrait }">
                <img :src="handlePost.postItem.post_cover" alt="" ref="cover" @load="image" />
            </div>

            <div class="time">
                {{ postTime }}
            </div>

            <div class="control">
                <div :class="{ isLike: isLike, heartIcon: true }">
                    <button @click="likes">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#heart"></use>
                        </svg>
                    </button>
                    <p v-if="!handlePost.postItem.like_count">0</p>
                    <p v-else>{{ handlePost.postItem.like_count }}</p>
                </div>
                <div class="commentIcon">
                    <a href="#comment">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#chat-empty"></use>
                        </svg>
                    </a>
                    <p v-if="!handlePost.postItem.comment_count">0</p>
                    <p v-else>{{ handlePost.postItem.comment_count }}</p>
                </div>
            </div>

            <div class="writeComment" id="comment">
                <span class="title">
                    回复: <router-link :to="/user/ + handlePost.postItem.username">@{{ handlePost.postItem.username }}</router-link>
                </span>
                <div class="box">
                    <div class="left">
                        <img :src="handlePost.postItem.head" alt="" />
                    </div>
                    <div class="right">
                        <v-md-editor v-model="text" left-toolbar="undo redo | emoji" mode="edit" height="100px"></v-md-editor>
                    </div>
                </div>
            </div>
            <form @submit.prevent="handleSubmit">
                <input type="hidden" name="comment" :value="text" />
                <button type="submit" class="button">回复</button>
            </form>
            <iframe name="stop" style="display: none"></iframe>

            <div class="comment">
                <div v-if="message" class="message">
                    {{ message }}
                </div>
                <ul>
                    <li v-for="cid in comment" :key="cid">
                        <router-link :to="/user/ + cid.username">
                            <div class="head">
                                <img :src="cid.head" alt="" />
                            </div>
                        </router-link>
                        <div class="text">
                            <div class="user">
                                <router-link :to="/user/ + cid.username">
                                    <span>{{ cid.name }}</span>
                                    <p>@{{ cid.username }}</p>
                                </router-link>
                                <p>{{ cid.create_time }}</p>
                            </div>
                            <div class="content">
                                {{ cid.comment }}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <sideFooter :author="author" />
    </div>
</template>

<script>
import markdownIt from "markdown-it";
import topNav from "@/components/topNav.vue";
import sideFooter from "@/components/sideFooter.vue";
import { postStore } from "@/stores/post";
import aotolog from "autolog.js";
import axios from "axios";

export default {
    props: ["pid"],
    components: {
        topNav,
        sideFooter,
    },
    data() {
        const post = postStore();
        return {
            handlePost: post,
            accessToken: localStorage.getItem("accessToken"),
            isLandscape: false,
            isPortrait: false,
            postContent: null,
            compiledMarkdown: "",
            text: "发布你的回复",
            postTime: null,
            isLike: false,
            throttledLikes: null,
            author: {},
            comment: [],
            message: null,
            topNavTitle: "帖子",
            show: 1,
        };
    },
    methods: {
        image() {
            let aspectRatio = this.$refs.cover.naturalWidth / this.$refs.cover.naturalHeight;

            if (aspectRatio > 1) {
                this.isLandscape = true;
                this.isPortrait = false;
            } else {
                this.isPortrait = true;
                this.isLandscape = false;
            }
        },
        showMarkdown() {
            const md = markdownIt();
            this.compiledMarkdown = md.render(this.postContent);
        },
        handleTime(time) {
            let date = new Date(time);
            let year = date.getUTCFullYear();
            let month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
            let day = date.getUTCDate().toString().padStart(2, "0");
            let hour = date.getUTCHours().toString().padStart(2, "0");
            let minute = date.getUTCMinutes().toString().padStart(2, "0");

            return `上午${hour}:${minute} · ${year}年${month}月${day}日`;
        },
        async getComment() {
            try {
                await this.handlePost.getComment({ pid: this.pid });

                if (this.handlePost.message) {
                    this.message = this.handlePost.message;
                    return;
                }

                this.comment = this.handlePost.comment;
                for (let i = 0; i < this.comment.length; i++) {
                    let comment = this.comment[i];
                    let time = this.handleTime(comment.create_time);
                    this.comment[i].create_time = time;
                }
            } catch (err) {
                console.log(err);
            }
        },
        async getDetailPost() {
            try {
                await this.handlePost.getDetailPost(this.accessToken, { pid: this.pid });
                this.postContent = this.handlePost.postItem.post_content;
                let { head, name, username, introduction } = this.handlePost.postItem;
                this.author = { head, name, username, introduction };
                if (this.handlePost.postItem.user_like_status === 1) {
                    this.isLike = true;
                }
                this.showMarkdown();
                let time = this.handleTime(this.handlePost.postItem.create_time);
                this.postTime = time;
                this.getComment();
            } catch (err) {
                console.log(err);
            }
        },
        async addHeart() {
            try {
                await this.handlePost.heart(this.accessToken, { pid: this.pid });
                if (this.handlePost.message) {
                    aotolog.log(this.handlePost.message, "warn", 2500);
                }
                this.handlePost.postItem.like_count++;
            } catch (err) {
                aotolog.log(err, "warn", 2500);
            }
        },
        async delHeart() {
            try {
                await this.handlePost.noHeart(this.accessToken, { pid: this.pid });
                if (this.handlePost.message) {
                    aotolog.log(this.handlePost.message, "warn", 2500);
                }
                this.handlePost.postItem.like_count--;
            } catch (err) {
                aotolog.log(err, "warn", 2500);
            }
        },
        throttle(func, limit) {
            let inThrottle;
            return function () {
                const context = this;
                const args = arguments;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                }
            };
        },
        likes() {
            // 调用节流函数
            this.throttledLikes();
        },
        async handleLikes() {
            if (this.isLike) {
                await this.delHeart();
                this.isLike = false;
            } else {
                await this.addHeart();
                this.isLike = true;
            }
        },
        async handleSubmit(event) {
            // 阻止默认的提交行为
            event.preventDefault();

            // 获取表单数据
            const formData = new FormData(event.target);
            formData.append("pid", this.handlePost.postItem.pid);

            try {
                // 发起 POST 请求
                const response = await axios.post("/comment", formData, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                });

                // 处理请求成功的响应
                aotolog.log(response.data.message, "success", 2500);
            } catch (error) {
                // 处理请求失败的情况
                console.error("Error:", error);
                aotolog.log(response.data.message, "error", 2500);
            }
        },
    },
    mounted() {
        this.getDetailPost();
        this.throttledLikes = this.throttle(this.handleLikes, 1000);
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/postPage.scss";
</style>
