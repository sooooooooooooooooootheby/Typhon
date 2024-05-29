<template>
    <topNav :title="topNavTitle" />
    <div class="postStream" v-on:scroll="handleScroll" ref="postStream">
        <div class="stream">
            <card v-for="(pid, index) in post" :key="pid" :post="post[index]" />
            <div class="loading" ref="loading">
                <div class="spinner center" ref="loadingIcon" v-if="!message">
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                    <div class="spinner-blade"></div>
                </div>
                <span>{{ message }}</span>
            </div>
        </div>
        <sideFooter />
    </div>
</template>

<script>
import { postStore } from "@/stores/post";
import card from "@/components/card.vue";
import topNav from "@/components/topNav.vue";
import sideFooter from "@/components/sideFooter.vue";
export default {
    components: {
        topNav,
        card,
        sideFooter,
    },
    data() {
        const post = postStore();
        return {
            handlePost: post,
            accessToken: localStorage.getItem("accessToken"),
            page: 1,
            pageSize: 100,
            post: [],
            newPost: [],
            message: null,
            topNavTitle: "主页",
            scrollTop: 0,
        };
    },
    methods: {
        async getPost() {
            try {
                await this.handlePost.getPost(this.accessToken, { page: this.page, pageSize: this.pageSize });
                this.newPost = this.handlePost.postItem;
                if (this.newPost.length > 0) {
                    this.post = [...this.post, ...this.newPost];
                    this.page++;
                } else {
                    this.message = "没有更多帖子了，或许你可以过段时间刷新一下";
                }
            } catch (err) {
                console.log(err);
            }
        },
        async getPostNoLogin() {
            try {
                await this.handlePost.getPostNoLogin({ page: this.page, pageSize: this.pageSize });
                this.post = this.handlePost.postItem;
                this.message = "登录查看更多帖子";
            } catch (err) {
                console.log(err);
            }
        },
        addScrollListener() {
            const element = this.$refs.postStream;
            element.addEventListener("scroll", this.handleScroll);
        },
        removeScrollListener() {
            const element = this.$refs.postStream;
            element.removeEventListener("scroll", this.handleScroll);
        },
        handleScroll() {
            const element = this.$refs.postStream;
            this.scrollTop = element.scrollTop;
        },
    },
    mounted() {
        if (this.accessToken) {
            this.getPost();
            setTimeout(() => {
                observer.observe(this.$refs.loadingIcon);
            }, 1000);
        } else {
            this.getPostNoLogin();
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.getPost();
                }
            });
        });

        this.addScrollListener();
    },
    beforeDestroy() {
        this.removeScrollListener();
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/postStream.scss";
</style>
