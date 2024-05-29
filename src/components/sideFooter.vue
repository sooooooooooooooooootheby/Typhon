<template>
    <footer class="sideFooter">
        <div class="author" v-if="author">
            <span class="title">作者</span>
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
            <span>Typhon的新伙伴?</span>
            <p>加入我们？立刻注册!</p>
            <div class="buttonBox">
                <router-link to="/register"><button>注册</button></router-link>
                <router-link to="/login"><button>登录</button></router-link>
            </div>
        </div>
        <div class="status" v-else-if="isStatus">
            <span>订阅 Pro</span>
            <p>订阅以解锁新功能，无论符不符合条件，都不可以获得广告分成(笑死，根本不会有广告收入)</p>
            <router-link to="/status"><button>订阅</button></router-link>
        </div>
        <div class="newUser">
            <span class="title">新的伙伴!</span>
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
        }
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
