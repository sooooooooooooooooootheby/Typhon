<template>
    <topNav :title="topNavTitle" :noSearch="noSearch" />
    <div class="settingPage">
        <div class="setting">
            <ul class="menu">
                <li>
                    <router-link to="/setting" :class="{ select: isUser }">
                        <div>
                            <span> 你的账户 </span>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#arrow-forward-simple"></use>
                            </svg>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link to="/status">
                        <div>
                            <span> 升级状态 </span>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#arrow-forward-simple"></use>
                            </svg>
                        </div>
                    </router-link>
                </li>
            </ul>
            <div class="main">
                <router-view />
            </div>
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

            topNavTitle: "设置",
            noSearch: 1,

            isUser: false,
        };
    },
    watch: {
        "$route.path": {
            handler(newPath) {
                this.isUser = /^\/setting$/.test(newPath);
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/settingPage.scss";
</style>
