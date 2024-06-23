<template>
    <topNav :title="topNavTitle" :show="show" />
    <div class="postPage">
        <div class="post">
            <div class="author">
                <router-link :to="/user/ + handlePost.postDetail.username">
                    <img :src="handlePost.postDetail.head" alt="" />
                    <div class="text">
                        <span>{{ handlePost.postDetail.name }}</span>
                        <p>@{{ handlePost.postDetail.username }}</p>
                    </div>
                </router-link>
            </div>

            <blockquote class="content">
                <p v-html="compiledMarkdown"></p>
            </blockquote>

            <div class="cover" :class="{ landscape: isLandscape, portrait: isPortrait }">
                <img :src="handlePost.postDetail.cover" alt="" ref="cover" @load="image" />
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
                    <p v-if="!handlePost.postDetail.like_count">0</p>
                    <p v-else>{{ handlePost.postDetail.like_count }}</p>
                </div>
                <div class="commentIcon">
                    <a href="#comment">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#chat-empty"></use>
                        </svg>
                    </a>
                    <p v-if="!handlePost.postDetail.comment_count">0</p>
                    <p v-else>{{ handlePost.postDetail.comment_count }}</p>
                </div>
            </div>

            <div class="writeComment" id="comment">
                <span class="title">
                    {{ $t("post.reply") }}: <router-link :to="/user/ + handlePost.postDetail.username">@{{ handlePost.postDetail.username }}</router-link>
                </span>
                <div class="box">
                    <div class="left">
                        <img :src="handleUser.userInfo.head" alt="" />
                    </div>
                    <div class="right">
                        <v-md-editor v-model="text" left-toolbar="undo redo | emoji" mode="edit" height="100px"></v-md-editor>
                    </div>
                </div>
            </div>
            <form @submit.prevent="handleSubmit">
                <input type="hidden" name="comment" :value="text" />
                <button type="submit" class="button">{{ $t("post.replyButton") }}</button>
            </form>
            <iframe name="stop" style="display: none"></iframe>

            <div class="comment">
                <ul>
                    <li v-for="cid in commentList" :key="cid">
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
                                <p>{{ time(cid.create_time) }} {{ $t(times) }}</p>
                            </div>
                            <div class="content">
                                {{ cid.content }}
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
import { userStore } from "@/stores/user";
import aotolog from "autolog.js";

export default {
    props: ["pid"],
    components: {
        topNav,
        sideFooter,
    },
    data() {
        const post = postStore();
        const user = userStore();
        return {
            handlePost: post,
            handleUser: user,

            accessToken: localStorage.getItem("accessToken"),
            isLandscape: false,
            isPortrait: false,

            compiledMarkdown: "",
            text: "",
            postTime: null,
            isLike: false,
            throttledLikes: null,
            throttledComment: null,
            author: {},

            topNavTitle: "post.title",
            show: 1,

            commentList: [],
            page: 1,
            pageSize: 5,
            times: "",
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
            this.compiledMarkdown = md.render(this.handlePost.postDetail.content);
        },
        handleTime(time) {
            let date = new Date(time);
            let year = date.getUTCFullYear();
            let month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
            let day = date.getUTCDate().toString().padStart(2, "0");
            let hour = date.getUTCHours().toString().padStart(2, "0");
            let minute = date.getUTCMinutes().toString().padStart(2, "0");

            return `${hour}:${minute} · ${year}-${month}-${day}`;
        },
        time(time) {
            const currentTime = new Date();
            const articleCreateTime = new Date(time);
            const timeDifference = currentTime - articleCreateTime;

            const secondsDifference = Math.floor(timeDifference / 1000);
            const minutesDifference = Math.floor(secondsDifference / 60);
            const hoursDifference = Math.floor(minutesDifference / 60);
            const daysDifference = Math.floor(hoursDifference / 24);
            const yearDifference = Math.floor(daysDifference / 365);

            let displayTimeDifference = "";
            if (yearDifference > 0) {
                displayTimeDifference = `${yearDifference}`;
                this.times = "post.time.year";
            } else if (daysDifference > 0) {
                displayTimeDifference = `${daysDifference}`;
                this.times = "post.time.day";
            } else if (hoursDifference > 0) {
                displayTimeDifference = `${hoursDifference}`;
                this.times = "post.time.hour";
            } else if (minutesDifference > 0) {
                displayTimeDifference = `${minutesDifference}`;
                this.times = "post.time.minutes";
            } else {
                displayTimeDifference = `${secondsDifference}`;
                this.times = "post.time.seconds";
            }

            return displayTimeDifference;
        },
        async getDetailPost() {
            try {
                await this.handlePost.getPostDetail({ token: this.accessToken, pid: this.pid });

                if (!this.handlePost.code === 0) {
                    this.handlePost.code = null;
                    return aotolog.log(this.handlePost.message, "error", this.logTimeout);
                }

                this.showMarkdown();
                this.postTime = this.handleTime(this.handlePost.postDetail.create_time);
                this.author = { head: this.handlePost.postDetail.head, name: this.handlePost.postDetail.name, username: this.handlePost.postDetail.username, introduction: this.handlePost.postDetail.introduction };
                document.title = `${this.author.name} ${ this.title } | Typhon`;
            } catch (err) {
                console.log(err);
            }
        },
        async like(token, pid) {
            try {
                await this.handlePost.like({ token: token, pid: pid });

                if (!this.handlePost.code === 0) {
                    this.handlePost.code = null;
                    return aotolog.log(this.handlePost.message, "error", this.logTimeout);
                }

                this.isLike = true;
                this.handlePost.postDetail.like_count++;
            } catch (error) {
                aotolog.log(error.request.response, "warn", 2500);
            }
        },
        async unlike(token, pid) {
            try {
                await this.handlePost.unlike({ token: token, pid: pid });

                if (!this.handlePost.code === 0) {
                    this.handlePost.code = null;
                    return aotolog.log(this.handlePost.message, "error", this.logTimeout);
                }

                this.isLike = false;
                this.handlePost.postDetail.like_count--;
            } catch (error) {
                console.log(error);
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
        handleLikes() {
            if (this.isLike) {
                this.unlike(this.accessToken, this.pid);
            } else {
                this.like(this.accessToken, this.pid);
            }
        },
        async getPostComment() {
            try {
                await this.handlePost.getPostComment({ pid: this.pid, page: this.page, pageSize: this.pageSize });

                if (!this.handlePost.code === 0) {
                    this.handlePost.code = null;
                    return aotolog.log(this.handlePost.message, "error", this.logTimeout);
                }

                this.commentList = this.handlePost.postCommentList;
                this.handlePost.postCommentList = [];
            } catch (err) {
                console.log(err);
            }
        },
        handleSubmit(event) {
            event.preventDefault();
            this.throttledComment();
        },
        async submitComment() {
            try {
                await this.handlePost.comment({ token: this.accessToken, pid: this.pid, content: this.text });

                if (!this.handlePost.code === 0) {
                    this.handlePost.code = null;
                    return aotolog.log(this.handlePost.message, "error", this.logTimeout);
                }

                aotolog.log(this.handlePost.message, "success", this.logTimeout);
                const newComment = {
                    head: this.handleUser.userInfo.head,
                    name: this.handleUser.userInfo.name,
                    username: this.handleUser.userInfo.username,
                    create_time: new Date(),
                    content: this.text,
                }
                this.commentList = [newComment, ...this.commentList];
            } catch (err) {
                console.log(err);
            }
        },
    },
    mounted() {
        this.getDetailPost();
        this.getPostComment();
        this.throttledLikes = this.throttle(this.handleLikes, 1000);
        this.throttledComment = this.throttle(this.submitComment, 1000);

        if (this.handlePost.postDetail.user_like_status === 1) {
            this.isLike = true;
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/postPage.scss";
</style>
