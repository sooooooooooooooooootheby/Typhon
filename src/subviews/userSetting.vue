<template>
    <div class="title">你的账户</div>
    <div class="user">
        <div class="noLoginUserSetting" v-if="!token"><router-link to="/login">登录</router-link>后查看用户相关设置</div>
        <div class="userSetting" v-else>
            <ul>
                <span class="subTitle">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#user-circle"></use>
                    </svg>
                    用户信息
                </span>
                <li>
                    <div>
                        <span>用户名</span>
                        <p>@{{ handleUser.userInfo.username }}</p>
                    </div>
                </li>
                <li>
                    <div>
                        <span>账户创建时间</span>
                        <p @load="handleTime">{{ create_time }}</p>
                    </div>
                </li>
                <p>个人信息前往<router-link :to="/user/ + handleUser.userInfo.username">个人资料页</router-link>编辑个人资料</p>
            </ul>
            <ul>
                <span class="subTitle">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#face-id"></use>
                    </svg>
                    安全信息
                </span>
                <li @click="cutEmailPanel('email')">
                    <div>
                        <span>邮箱</span>
                        <p>{{ handleUser.userInfo.email }}</p>
                    </div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#arrow-forward-simple"></use>
                    </svg>
                </li>
                <li @click="cutEmailPanel('password')">
                    <div>
                        <span>密码</span>
                        <p>修改你的密码</p>
                    </div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#arrow-forward-simple"></use>
                    </svg>
                </li>
                <li @click="cutEmailPanel('deleteUser')">
                    <div>
                        <span>注销账户</span>
                        <p>将你的账户从服务器中删除</p>
                    </div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#arrow-forward-simple"></use>
                    </svg>
                </li>
                <updateEmail v-if="isShowCard" :cardParameter="cardParameter" />
            </ul>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import updateEmail from "@/components/windows/updateCard.vue";
import topNav from "@/components/topNav.vue";

export default {
    components: {
        updateEmail,
        topNav,
    },
    data() {
        const user = userStore();
        return {
            handleUser: user,
            email: "",
            password: "",

            isShowCard: false,
            cardParameter: "null",

            token: localStorage.getItem("accessToken"),
            create_time: null,
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
        // 处理时间戳
        handleTime(time) {
            time = time.slice(0, 10) + " " + time.slice(11, 19);
            this.create_time = time
        },
    },
    mounted() {
        setTimeout(() => {
            this.handleTime(this.handleUser.userInfo.create_time);
        }, 100);
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/userSetting.scss";
</style>
