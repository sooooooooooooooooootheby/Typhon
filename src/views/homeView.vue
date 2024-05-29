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
import write from "@/components/write.vue";

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
        async getTokenUserInfo() {
            if (this.accessToken) {
                const fetchData = async () => {
                    await this.handleUser.getTokenUserInfo(this.accessToken);
                };
                fetchData();
            }
        },
        async verifyToken() {
            const accessTokenPayload = jwtDecode(this.accessToken).exp * 1000;
            const refreshTokenPayload = jwtDecode(this.refreshToken).exp * 1000;
            const time = Date.now();

            if (time >= accessTokenPayload) {
                // accessToken 过期
                console.log("accessToken 过期");
                if (time >= refreshTokenPayload) {
                    // refreshToken 过期
                    console.log("refreshToken 过期");
                    router.push("/login");
                }

                try {
                    await this.handleUser.getAccessToken(this.refreshToken);
                    if (this.handleUser.code === 1) {
                        this.getTokenUserInfo();
                    } else if (this.handleUser.code === 2) {
                        router.push("/login");
                    } else {
                        console.log("未知code: " + this.handleUser.code);
                    }
                } catch (error) {
                    console.log(error);
                }

                return;
            }

            // token 有效
            this.getTokenUserInfo();
        },
    },
    mounted() {
        if (this.accessToken) {
            this.verifyToken();
        }
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
