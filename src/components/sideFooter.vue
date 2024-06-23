<template>
    <footer class="sideFooter">
        <div class="author" v-if="author">
            <span class="title">{{ $t("author.title") }}</span>
            <router-link :to="/user/ + author.username">
                <div class="head">
                    <img :src="author.head" alt="" />
                </div>
                <div class="text">
                    <span>{{ author.name }}</span>
                    <p>@{{ author.username }}</p>
                    <blockquote>{{ author.introduction }}</blockquote>
                </div>
            </router-link>
        </div>
        <div class="login" v-if="!accessToken">
            <span>{{ $t("login.title") }}</span>
            <p>{{ $t("login.text") }}</p>
            <div class="buttonBox">
                <router-link to="/register"><button>{{ $t("login.register") }}</button></router-link>
                <router-link to="/login"><button>{{ $t("login.login") }}</button></router-link>
            </div>
        </div>
        <div class="status" v-else-if="isStatus">
            <span>{{ $t("status.title") }}</span>
            <p>{{ $t("status.text") }}</p>
            <router-link to="/status"><button>{{ $t("status.button") }}</button></router-link>
        </div>
        <div class="newUser">
            <span class="title">{{ $t("newUser.title") }}</span>
            <ul>
                <li v-for="(user, index) in handleUser.newUser" :key="index">
                    <a :href="/user/ + user.username">
                        <div class="head">
                            <img :src="user.head" alt="" />
                        </div>
                        <div class="text">
                            <span>{{ user.name }}</span>
                            <p>@{{ user.username }}</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </footer>
</template>

<script>
import { userStore } from "@/stores/user";

export default {
    props: ["pid", "author"],
    data() {
        const user = userStore();
        return {
            handleUser: user,
            accessToken: localStorage.getItem("accessToken"),
            isStatus: true,
        };
    },
    methods: {
        async getNewUser() {
            try {
                await this.handleUser.getNewUser();
            } catch (error) {
                console.log(error);
            }
        },
        conditionStatus(newUserInfo) {
            const userStatus = newUserInfo.status;
            const regex = /Pro.+/;
            if (regex.test(userStatus)) {
                this.isStatus = false;
            }
        },
        verifyStatus() {
            const userStatus = this.handleUser.userInfo.status;
            const regex = /Pro.+/;
            if (regex.test(userStatus)) {
                this.isStatus = false;
            }
        },
    },
    mounted() {
        this.getNewUser();
        this.verifyStatus();
    },
    watch: {
        "handleUser.userInfo": {
            handler: function (newUserInfo, oldUserInfo) {
                // 调用处理函数
                this.conditionStatus(newUserInfo);
            },
            deep: true, // 监听对象的变化
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/sideFooter.scss";
</style>
