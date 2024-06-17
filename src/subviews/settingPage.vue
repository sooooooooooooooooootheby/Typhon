<template>
    <div class="settingPage">
        <div class="setting">
            <ul>
                <span class="title">设置</span>
                <li v-if="email">账户管理</li>
            </ul>
            <div class="main">
                <div class="user" v-if="email">
                    <span class="title">账户管理</span>
                    <ul>
                        <span>用户信息</span>
                        <li>
                            <span>用户名</span>
                            <p>@{{ handleUser.userInfo.username }}</p>
                        </li>
                        <li>
                            <span>账户创建时间</span>
                            <p>{{ handleUser.userInfo.create_time }}</p>
                        </li>
                    </ul>
                    <p>个人信息前往<router-link :to="/user/ + handleUser.userInfo.username">个人资料页</router-link>编辑个人资料</p>
                    <ul>
                        <span>安全信息</span>
                        <li @click="cutEmailPanel('email')">
                            <span>邮箱</span>
                            <p>{{ handleUser.userInfo.email }}</p>
                        </li>
                        <li @click="cutEmailPanel('password')">
                            <span>密码</span>
                            <p>修改你的密码</p>
                        </li>
                        <li @click="cutEmailPanel('deleteUser')">
                            <span>注销账户</span>
                            <p>将你的账户从服务器中删除</p>
                        </li>
                        <updateEmail v-if="isShowCard" :cardParameter="cardParameter" />
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import updateEmail from "@/components/windows/updateCard.vue";

export default {
    components: {
        updateEmail,
    },
    data() {
        const user = userStore();
        return {
            handleUser: user,
            email: "",
            password: "",

            isShowCard: false,
            cardParameter: "null",
        };
    },
    methods: {
        cutEmailPanel(parameter) {
            switch (parameter) {
                case "email":
                    this.cardParameter = "email";
                    break;
                case "password":
                    this.cardParameter = "password";
                    break;
                case "deleteUser":
                    this.cardParameter = "deleteUser";
                    break;
                default:
                    break;
            }
            this.isShowCard = !this.isShowCard;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/settingPage.scss";
</style>
