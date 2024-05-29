<template>
    <div class="card">
        <router-link :to="/post/ + post.pid">
            <div class="head">
                <img :src="post.head" alt="head" />
            </div>
            <div class="postContent">
                <div class="authorInfo">
                    <span>{{ post.name }}</span>
                    <p>@{{ post.username }}</p>
                    <p>·</p>
                    <p ref="time" @load="times">{{ create_time }}</p>
                </div>

                <blockquote class="content">
                    <p v-html="compiledMarkdown"></p>
                </blockquote>

                <div v-if="post.post_cover" :class="{ landscape: isLandscape, portrait: isPortrait }">
                    <img v-lazy="post.post_cover" alt="" ref="cover" @load="image" />
                </div>
            </div>
        </router-link>

        <div class="control">
            <div class="heart" :class="{ isLike: isLike, heartIcon: true }">
                <button @click="likes" @click.stop="someMethod">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#heart"></use>
                    </svg>
                </button>
                <p v-if="!post.like_count">0</p>
                <p v-else>{{ post.like_count }}</p>
            </div>
            <div class="commentIcon">
                <a :href="/post/ + `${post.pid}#comment`">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#chat-empty"></use>
                    </svg>
                </a>
                <p v-if="!post.comment_count">0</p>
                <p v-else>{{ post.comment_count }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import markdownIt from "markdown-it";
import axios from "axios";
import aotolog from "autolog.js";

export default {
    props: ["post"],
    data() {
        return {
            create_time: null,
            markdownText: "# Hello, *world*!",
            compiledMarkdown: "",
            isLike: false,
            throttledLikes: null,
            isLandscape: false,
            isPortrait: false,
            accessToken: localStorage.getItem("accessToken"),
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
        time() {
            // 获取当前时间
            const currentTime = new Date();

            // 假设文章创建时间为 post.create_time（假设为字符串形式的 ISO 8601 时间格式）
            const articleCreateTime = new Date(this.post.create_time);

            // 计算时间差（单位为毫秒）
            const timeDifference = currentTime - articleCreateTime;

            // 将时间差转换为发布多久的形式
            const secondsDifference = Math.floor(timeDifference / 1000);
            const minutesDifference = Math.floor(secondsDifference / 60);
            const hoursDifference = Math.floor(minutesDifference / 60);
            const daysDifference = Math.floor(hoursDifference / 24);
            const yearDifference = Math.floor(daysDifference / 365);

            let displayTimeDifference = "";
            if (yearDifference > 0) {
                displayTimeDifference = `${yearDifference} 年前`;
            } else if (daysDifference > 0) {
                displayTimeDifference = `${daysDifference} 天前`;
            } else if (hoursDifference > 0) {
                displayTimeDifference = `${hoursDifference} 小时前`;
            } else if (minutesDifference > 0) {
                displayTimeDifference = `${minutesDifference} 分钟前`;
            } else {
                displayTimeDifference = `${secondsDifference} 秒前`;
            }

            this.create_time = displayTimeDifference;
        },
        showMarkdown() {
            const md = markdownIt();
            this.compiledMarkdown = md.render(this.$props.post.post_content);
        },
        async addHeart(token, pid) {
            try {
                const res = await axios.post(
                    "/heart",
                    { pid },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                this.isLike = true;
                this.post.like_count++;
            } catch (error) {
                aotolog.log(error.request.response, "warn", 2500);
            }
        },
        async delHeart(token, pid) {
            try {
                const res = await axios.post(
                    "/noheart",
                    { pid },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                this.isLike = false;
                this.post.like_count--;
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
            this.throttledLikes();
        },
        async handleLikes() {
            if (this.isLike) {
                await this.delHeart(this.accessToken, this.post.pid);
            } else {
                await this.addHeart(this.accessToken, this.post.pid);
            }
        },
    },
    mounted() {
        this.time();
        this.showMarkdown();
        this.throttledLikes = this.throttle(this.handleLikes, 1000);

        if (this.post.user_like_status === 1) {
            this.isLike = true;
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/card.scss";
</style>
