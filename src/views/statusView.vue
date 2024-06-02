<template>
    <div class="pro">
        <div class="exit">
            <span v-if="isPro">在找返回按钮？难道你不升级Pro就想走？</span>
            <router-link to="/" v-else>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#close"></use>
                </svg>
            </router-link>
        </div>
        <div class="boll"></div>
        <div class="title">
            <span>升级成为Pro用户!</span>
            <p>Typhon未来有可能会倒闭，但绝不会变质</p>
            <p>(如果想给我打赏，<a href="#">请点击这里)</a></p>
        </div>
        <div class="panel">
            <div class="card">
                <span>Lite</span>
                <div class="price">
                    <p>CN￥0<span>/年</span></p>
                    <span class="tag">限时永久0元</span>
                    <span class="tag">按年计费</span>
                </div>
                <button @click="handleStatus('Pro Lite')">订阅</button>
                <ul>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#checkdouble"></use>
                        </svg>
                        <p>获得Pro Lite状态</p>
                    </li>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#checkdouble"></use>
                        </svg>
                        <p>解锁所有的功能</p>
                    </li>
                </ul>
            </div>
            <div class="card">
                <span>Max</span>
                <div class="price">
                    <p>CN￥0<span>/年</span></p>
                    <span class="tag">限时永久0元</span>
                    <span class="tag">按年计费</span>
                </div>
                <button @click="handleStatus('Pro Max')">订阅</button>
                <ul>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#checkdouble"></use>
                        </svg>
                        <p>获得Pro Max状态</p>
                    </li>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#checkdouble"></use>
                        </svg>
                        <p>解锁所有的功能</p>
                    </li>
                </ul>
            </div>
            <div class="card ultra">
                <span>Ultra</span>
                <div class="price">
                    <p>CN￥0<span>/年</span></p>
                    <span class="tag">限时永久0元</span>
                    <span class="tag">按年计费</span>
                </div>
                <button @click="handleStatus('Pro Ultra')">订阅</button>
                <ul>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#checkdouble"></use>
                        </svg>
                        <p>获得Pro Ultra状态</p>
                    </li>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#checkdouble"></use>
                        </svg>
                        <p>解锁所有的功能</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user";
import aotolog from "autolog.js";

export default {
    data() {
        const user = userStore();
        return {
            handleUser: user,
            isPro: true,
            accessToken: localStorage.getItem("accessToken"),
        };
    },
    methods: {
        async handleStatus(status) {
            try {
                await this.handleUser.updateStatus({
                    token: this.accessToken,
                    status: status,
                });
                if (this.handleUser.code === 0) {
                    return aotolog.log(this.handleUser.message, "error", 2500);
                }

                aotolog.log(this.handleUser.message, "success", 2500);
                this.isPro = false;
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>

<style scoped>
@import "@/assets/css/views/statusView.scss";
</style>
