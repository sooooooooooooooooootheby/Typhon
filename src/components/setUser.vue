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
                            <ImgCutter rate="12.2:4" @cutDown="cutCover">
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
import { uploadStore } from "@/stores/upload.js";
import ImgCutter from "vue-img-cutter";
import aotolog from "autolog.js";
import axios from "axios";

export default {
    props: ["usersInfo"],
    components: {
        ImgCutter,
    },
    data() {
        const user = userStore();
        const upload = uploadStore();
        return {
            handleUser: user,
            handleUpload: upload,

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
            coverInfo: {},

            head: null,
            headInfo: {},
            token: localStorage.getItem("accessToken"),
        };
    },
    methods: {
        // 写入信息
        writeInUserInfo() {
            this.nameValue = this.usersInfo.name;
            this.introductionValue = this.usersInfo.introduction;
            this.placeValue = this.usersInfo.place;
            this.websiteValue = this.usersInfo.website;
            this.cover = this.usersInfo.background_image;
            this.head = this.usersInfo.head;
            this.limitInput(this.nameValue, 23, "nameValue", "nameWarn", "nameCharCount");
            this.limitInput(this.introductionValue, 254, "introductionValue", "introductionWarn", "introductionCharCount");
            this.limitInput(this.placeValue, 29, "placeValue", "placeWarn", "placeCharCount");
            this.limitInput(this.websiteValue, 99, "websiteValue", "websiteWarn", "websiteCharCount");
        },
        limitInput(value, maxChars, valueProperty, warnProperty, charCountProperty) {
            let currentCount = 0;
            if (!value) {
                return;
            }
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
            if (res.file.size > 5000000) {
                aotolog.log("图片过大，请上传小于5mb的图片", "warn", 2500);
                return;
            }
            this.cover = res.dataURL;
            this.coverInfo = res;
        },
        cutHead(res) {
            if (res.file.size > 5000000) {
                aotolog.log("图片过大，请上传小于5mb的图片", "warn", 2500);
                return;
            }
            this.head = res.dataURL;
            this.headInfo = res;
        },
        async handleSubmit(event) {
            // 阻止默认的提交行为
            event.preventDefault();

            if (JSON.stringify(this.coverInfo) != "{}") {
                try {
                    await this.handleUpload.uploadUserInfo_image({ token: this.token, imageInfo: this.coverInfo, imageType: "userCover" });
                } catch (err) {
                    console.log(err);
                }
            }

            if (JSON.stringify(this.headInfo) != "{}") {
                try {
                    await this.handleUpload.uploadUserInfo_image({ token: this.token, imageInfo: this.headInfo, imageType: "userHead" });
                } catch (err) {
                    console.log(err);
                }
            }

            const userInfo = {
                token: this.token,
                name: this.nameValue,
                introduction: this.introductionValue,
                place: this.placeValue,
                website: this.websiteValue,
            };

            if (this.handleUpload.headUrl) {
                userInfo.head = this.handleUpload.headUrl;
            }

            if (this.handleUpload.coverUrl) {
                userInfo.background_image = this.handleUpload.coverUrl;
            }

            try {
                await this.handleUser.updateUserInfo(userInfo);
                this.$parent.cutInfoPanel();
            } catch (err) {
                console.log(err);
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.writeInUserInfo();
        }, 500);
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/setUser.scss";
</style>
