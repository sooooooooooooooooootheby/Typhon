<template>
    <div class="body">
        <div class="sideNav">
            <sideNav />
        </div>
        <main class="main">
            <router-view />
            <write v-show="isWrite" />
        </main>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import { jwtDecode } from "jwt-decode";
import router from "@/router";
import sideNav from "@/components/sideNav.vue";
import write from "@/components/windows/write.vue";
import autolog from "autolog.js";

export default {
    components: {
        sideNav,
        write,
    },
    data() {
        const user = userStore();
        return {
            handleUser: user,
            accessToken: localStorage.getItem("accessToken"),
            refreshToken: localStorage.getItem("refreshToken"),
            isWrite: false,
        };
    },
    methods: {
        cutWritePanel() {
            this.isWrite = !this.isWrite;
        },
        // 获取用户信息
        async getUserInfo() {
            try {
                await this.handleUser.getUserInfo({ token: this.accessToken });

                if (!this.handleUser.code === 0) {
                    this.handleUser.code = null;
                    return autolog.log(this.handleUser.message, "error", this.logTimeout);
                }
            } catch (err) {
                console.log(err);
            }
        },
        async verifyToken() {
            const accessTokenPayload = jwtDecode(this.accessToken).exp * 1000;
            const refreshTokenPayload = jwtDecode(this.refreshToken).exp * 1000;
            const time = Date.now();

            if (time >= accessTokenPayload) {
                if (time >= refreshTokenPayload) {
                    return router.push("/login");
                }

                try {
                    await this.handleUser.updateAccessToken({ refreshToken: this.refreshToken });
                } catch (err) {
                    console.log(err);
                }
            }
            this.getUserInfo();
        },
    },
    mounted() {
        this.verifyToken();
    },
};
</script>

<style lang="scss" scoped>
.body {
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    .sideNav {
        flex-grow: 1;
        display: flex;
        align-items: flex-end;
    }
    .main {
        flex-grow: 1;
    }
}
</style>
