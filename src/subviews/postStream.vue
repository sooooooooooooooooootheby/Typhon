<template>
    <topNav :title="topNavTitle" />
    <div class="postStream" v-on:scroll="handleScroll" ref="postStream">
        <div class="stream">
            <card v-for="(pid, index) in postList" :key="pid" :post="postList[index]" />
            <div class="loadingBox" ref="loading">
                <div class="loader" v-if="!message"></div>
                <span>{{ $t(message) }}</span>
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
            message: "postStream.message",
            topNavTitle: "postStream.title",
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
            } catch (err) {
                console.log(err);
            }
        },
    },
    mounted() {
        this.getPost();
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.getPost();
                }
            });
        });

        setTimeout(() => {
            observer.observe(this.$refs.loading);
        }, 1000);
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/postStream.scss";
</style>
