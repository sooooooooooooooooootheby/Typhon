<template>
    <topNav :title="topNavTitle" />
    <div class="postStream" v-on:scroll="handleScroll" ref="postStream">
        <div class="stream">
            <card v-for="(pid, index) in postList" :key="pid" :post="postList[index]" />
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
import card from "@/components/windows/card.vue";
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
            pageSize: 5,
            postList: [],
            newPostList: [],
            message: null,
            topNavTitle: "主页",
        };
    },
    methods: {
        async getPost() {
            if (this.accessToken) {
                try {
                    await this.handlePost.getPost({ token: this.accessToken, page: this.page, pageSize: this.pageSize });

                    if (!this.handlePost.code === 0) {
                        this.handlePost.code = null;
                        return autolog.log(this.handlePost.message, "error", this.logTimeout);
                    }

                    this.newPostList = this.handlePost.postList;
                    if (this.newPostList.length > 0) {
                        this.postList = [...this.postList, ...this.newPostList];
                        this.page++;
                    } else {
                        this.message = "没有更多帖子了，或许你可以过段时间刷新一下";
                    }
                } catch (err) {
                    console.log(err);
                }
                return;
            }
            try {
                await this.handlePost.getPost({});

                if (!this.handlePost.code === 0) {
                    this.handlePost.code = null;
                    return autolog.log(this.handlePost.message, "error", this.logTimeout);
                }

                this.postList = this.handlePost.postList;
                this.message = "登录查看更多帖子";
            } catch (err) {
                console.log(err);
            }
        },
    },
    mounted() {
        this.getPost();
        setTimeout(() => {
            observer.observe(this.$refs.loadingIcon);
        }, 1000);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.getPost();
                }
            });
        });
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/postStream.scss";
</style>
