<template>
    <topNav :title="topNavTitle" :subTitle="topNavSubTitle" :show="show"/>
    <div class="userPage">
        <div class="user">
            <div class="info">
                <div class="cover">
                    <img :src="handleUser.usersInfo.background_image" alt="" v-if="handleUser.usersInfo.background_image" />
                </div>

                <div class="head">
                    <img :src="handleUser.usersInfo.head" alt="" />
                </div>

                <div class="text">
                    <div class="buttonNav">
                        <button v-if="handleUser.userInfo.username === handleUser.usersInfo.username" @click="cutInfoPanel()">编辑个人资料</button>
                    </div>
                    <div class="userInfo">
                        <span>
                            {{ handleUser.usersInfo.name }}
                            <span> ({{ handleUser.usersInfo.status }}) </span>
                        </span>
                        <p>@{{ handleUser.usersInfo.username }}</p>
                    </div>
                    <div class="introduction" v-if="handleUser.usersInfo.introduction">
                        <p>{{ handleUser.usersInfo.introduction }}</p>
                    </div>
                    <div class="place" v-if="handleUser.usersInfo.place">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#location"></use>
                        </svg>
                        <p>{{ handleUser.usersInfo.place }}</p>
                    </div>
                    <div class="website" v-if="handleUser.usersInfo.website">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#link"></use>
                        </svg>
                        <a :href="handleUser.usersInfo.website" target="_block">{{ handleUser.usersInfo.website }}</a>
                    </div>
                </div>
            </div>
            <div class="nav">
                <router-link :to="`/user/${handleUser.usersInfo.username}`" :class="{ select: isArticleList }">帖子</router-link>
                <router-link :to="`/user/${handleUser.usersInfo.username}/like`" :class="{ select: isLikeList }">喜欢</router-link>
            </div>
            <div class="content">
                <router-view :uid="uid" />
            </div>
        </div>
        <setUser v-show="isSetUser" :usersInfo="usersInfo" />
        <sideFooter />
    </div>
</template>

<script>
import topNav from "@/components/topNav.vue";
import sideFooter from "@/components/sideFooter.vue";
import setUser from "@/components/setUser.vue";
import { userStore } from "@/stores/user.js";

export default {
    props: ["username"],
    components: {
        topNav,
        sideFooter,
        setUser,
    },
    data() {
        const user = userStore();
        return {
            handleUser: user,

            isArticleList: true,
            isLikeList: false,
            isSetUser: false,
            topNavTitle: "",
            topNavSubTitle: "",
            show: 1,
            uid: null,
            usersInfo: {},
        };
    },
    methods: {
        async getUserInfo() {
            try {
                await this.handleUser.getUserInfo({ username: this.username });
                this.topNavTitle = this.handleUser.usersInfo.name;
                this.topNavSubTitle = this.handleUser.usersInfo.post_count + " 帖子  " + this.handleUser.usersInfo.like_count + " 喜欢";
                this.uid = this.handleUser.usersInfo.uid;
                this.usersInfo = this.handleUser.usersInfo;
            } catch (error) {
                console.log(error);
            }
        },
        cutInfoPanel() {
            this.isSetUser = !this.isSetUser;
        },
    },
    mounted() {
        this.getUserInfo();
    },
    watch: {
        "$route.path": {
            handler(newPath) {
                this.isArticleList = /^\/user\/[^\/]+$/.test(newPath);
                this.isLikeList = /^\/user\/[^\/]+\/like(\/|$)/.test(newPath);
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/userPage.scss";
</style>
