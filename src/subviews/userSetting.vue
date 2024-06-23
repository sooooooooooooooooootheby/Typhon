<template>
    <div class="title">{{ $t("user.title") }}</div>
    <div class="user">
        <div class="noLoginUserSetting" v-if="!token"><router-link to="/login">{{ $t("user.nologin.a") }}</router-link>{{ $t("user.nologin.p") }}</div>
        <div class="userSetting" v-else>
            <ul>
                <span class="subTitle">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#user-circle"></use>
                    </svg>
                    {{ $t("user.block1.title") }}
                </span>
                <li>
                    <div>
                        <span>{{ $t("user.block1.span1") }}</span>
                        <p>@{{ handleUser.userInfo.username }}</p>
                    </div>
                </li>
                <li>
                    <div>
                        <span>{{ $t("user.block1.span2") }}</span>
                        <p @load="handleTime">{{ create_time }}</p>
                    </div>
                </li>
                <p>{{ $t("user.block1.p1") }}<router-link :to="/user/ + handleUser.userInfo.username">{{ $t("user.block1.p2") }}</router-link>{{ $t("user.block1.p3") }}</p>
            </ul>
            <ul>
                <span class="subTitle">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#face-id"></use>
                    </svg>
                    {{ $t("user.block2.title") }}
                </span>
                <li @click="cutEmailPanel('email')">
                    <div>
                        <span>{{ $t("user.block2.span1") }}</span>
                        <p>{{ handleUser.userInfo.email }}</p>
                    </div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#arrow-forward-simple"></use>
                    </svg>
                </li>
                <li @click="cutEmailPanel('password')">
                    <div>
                        <span>{{ $t("user.block2.span2") }}</span>
                        <p>{{ $t("user.block2.p2") }}</p>
                    </div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#arrow-forward-simple"></use>
                    </svg>
                </li>
                <li @click="cutEmailPanel('deleteUser')">
                    <div>
                        <span>{{ $t("user.block2.span3") }}</span>
                        <p>{{ $t("user.block2.p3") }}</p>
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
