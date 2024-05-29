<template>
    <div class="bg" @click="this.$parent.cutInfoPanel()">
        <form @submit.prevent="handleSubmit">
            <div class="infoPanel" onclick="event.stopPropagation()">
                <div class="controlBar">
                    <div class="close" @click="this.$parent.cutInfoPanel()"></div>
                    <p>编辑个人资料</p>
                    <button type="submit" class="button">提交</button>
                </div>
                <div class="info">
                    <div class="cover">
                        <div class="update">
                            <ImgCutter rate="5.98:2" @cutDown="cutCover">
                                <template #open>
                                    <div class="button">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#camera-add-photo"></use>
                                        </svg>
                                    </div>
                                </template>
                            </ImgCutter>
                            <div class="button">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#close"></use>
                                </svg>
                            </div>
                        </div>
                        <img :src="cover" v-if="cover" />
                    </div>
                    <div class="head">
                        <div class="update">
                            <ImgCutter rate="1:1" @cutDown="cutHead">
                                <template #open>
                                    <div class="button">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#camera-add-photo"></use>
                                        </svg>
                                    </div>
                                </template>
                            </ImgCutter>
                        </div>
                        <img :src="head" alt="" />
                    </div>
                    <div class="input">
                        <label for="name">
                            <div>
                                <span>向大家展示的名字</span>
                                <span :class="{ warn: nameWarn }">{{ nameCharCount }} / 24</span>
                            </div>
                            <input type="text" name="name" id="name" v-model="nameValue" @input="limitInput(nameValue, 23, 'nameValue', 'nameWarn', 'nameCharCount')" />
                        </label>
                        <label for="introduction">
                            <div>
                                <span>简介</span>
                                <span :class="{ warn: introductionWarn }">{{ introductionCharCount }} / 255</span>
                            </div>
                            <textarea type="text" name="introduction" id="introduction" v-model="introductionValue" @input="limitInput(introductionValue, 254, 'introductionValue', 'introductionWarn', 'introductionCharCount')" rows="5" />
                        </label>
                        <label for="place">
                            <div>
                                <span>位置</span>
                                <span :class="{ warn: placeWarn }">{{ placeCharCount }} / 30</span>
                            </div>
                            <input type="text" name="place" id="place" v-model="placeValue" @input="limitInput(placeValue, 29, 'placeValue', 'placeWarn', 'placeCharCount')" />
                        </label>
                        <label for="website">
                            <div>
                                <span>网站</span>
                                <span :class="{ warn: websiteWarn }">{{ websiteCharCount }} / 100</span>
                            </div>
                            <div class="http">https://<input type="text" name="website" id="website" v-model="websiteValue" @input="limitInput(websiteValue, 99, 'websiteValue', 'websiteWarn', 'websiteCharCount')" /></div>
                        </label>
                    </div>
                </div>
            </div>
        </form>
        <iframe name="stop" style="display: none"></iframe>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import ImgCutter from "vue-img-cutter";
import aotolog from "autolog.js";
import axios from "axios";

export default {
    components: {
        ImgCutter,
    },
    data() {
        const user = userStore();
        return {
            handleUser: user,

            nameValue: null,
            nameCharCount: 0,
            nameWarn: false,

            introductionValue: null,
            introductionCharCount: 0,
            introductionWarn: false,

            placeValue: null,
            placeCharCount: 0,
            placeWarn: false,

            websiteValue: null,
            websiteCharCount: 0,
            websiteWarn: false,

            cover: null,
            head: null,
            token: localStorage.getItem("accessToken"),
            userInfo: null,
        };
    },
    methods: {
        getUserInfo() {
            if (this.token) {
                this.fetchData();
            }
        },
        async fetchData() {
            try {
                await this.handleUser.getTokenUserInfo(this.token);
                this.userInfo = this.handleUser.userInfo;
                this.nameValue = this.userInfo.name;
                this.introductionValue = this.userInfo.introduction;
                this.placeValue = this.userInfo.place;
                this.websiteValue = this.userInfo.website;
                this.cover = this.userInfo.background_image;
                this.head = this.userInfo.head;
                this.limitInput(this.nameValue, 23, "nameValue", "nameWarn", "nameCharCount");
                this.limitInput(this.introductionValue, 254, "introductionValue", "introductionWarn", "introductionCharCount");
                this.limitInput(this.placeValue, 29, "placeValue", "placeWarn", "placeCharCount");
                this.limitInput(this.websiteValue, 99, "websiteValue", "websiteWarn", "websiteCharCount");
            } catch (error) {
                console.log(error);
            }
        },
        limitInput(value, maxChars, valueProperty, warnProperty, charCountProperty) {
            let currentCount = 0;
            let newValue = value;

            for (let i = 0; i < value.length; i++) {
                const charCode = value.charCodeAt(i);
                let charLength = 1; // 默认为1个字节

                if (charCode > 0x7f && charCode <= 0x7ff) {
                    charLength = 2; // 占用2个字节
                } else if (charCode > 0x7ff && charCode <= 0xffff) {
                    charLength = 3; // 占用3个字节
                } else if (charCode > 0xffff) {
                    charLength = 4; // 占用4个字节
                }

                currentCount += charLength;

                if (currentCount > maxChars) {
                    newValue = value.substring(0, i);
                    break;
                }
            }
            this[valueProperty] = newValue;
            this[warnProperty] = currentCount > maxChars;
            this[charCountProperty] = currentCount;
        },
        cutCover(res) {
            console.log(res);
            if (res.file.size > 5000000) {
                aotolog.log("图片过大，请上传小于5mb的图片", "warn", 2500);
                return;
            }
            this.cover = res.dataURL;
        },
        cutHead(res) {
            if (res.file.size > 5000000) {
                aotolog.log("图片过大，请上传小于5mb的图片", "warn", 2500);
                return;
            }
            this.head = res.dataURL;
        },
        async handleSubmit(event) {
            // 阻止默认的提交行为
            event.preventDefault();
            const formData = new FormData(event.target);
            formData.append("cover", this.cover);
            formData.append("head", this.head);

            try {
                // 发起 POST 请求
                const response = await axios.post("http://127.0.0.1:4000/api/setUserInfo", formData, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });

                // 处理请求成功的响应
                aotolog.log("提交成功", "success", 2500);
            } catch (error) {
                // 处理请求失败的情况
                console.error("Error:", error);
                aotolog.log("提交失败", "error", 2500);
            }
        },
    },
    mounted() {
        this.getUserInfo();
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/setUser.scss";
</style>
