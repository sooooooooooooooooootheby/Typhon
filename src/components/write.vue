<template>
    <div class="bg" @click="this.$parent.cutWritePanel()">
        <div class="writePanel" onclick="event.stopPropagation()">
            <div class="control">
                <div class="close" @click="this.$parent.cutWritePanel()"></div>
            </div>
            <div class="line"></div>
            <div class="writeBox">
                <div class="head">
                    <img :src="handleUser.userInfo.head" alt="head" />
                </div>
                <div class="write">
                    <v-md-editor v-model="text" height="360px"></v-md-editor>
                </div>
            </div>
            <div class="toolBar">
                <form @submit.prevent="handleSubmit">
                    <input type="file" accept="image/*" v-on:change="onFileimage" name="cover" class="coverButton" id="cover" />
                    <input type="hidden" name="uid" :value="handleUser.userInfo.uid" />
                    <input type="hidden" name="post_content" :value="text" />
                    <label for="cover" class="cover">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#image"></use>
                        </svg>
                    </label>
                    <p v-show="imageName">已选择 {{ imageName }} 作为封面</p>
                    <button type="submit" class="button">发布!</button>
                </form>
                <iframe name="stop" style="display: none"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/user.js";
import { postStore } from "@/stores/post.js";
import aotolog from "autolog.js";
import axios from "axios";

export default {
    data() {
        const user = userStore();
        const post = postStore();
        return {
            handleUser: user,
            handlePost: post,
            text: '',
            imageName: '',
            selectedFile: null,
        }
    },
    methods: {
        onFileimage(event) {
            if (event.target.files[0].size > 5000000) {
                aotolog.log("图片过大，请上传小于5mb的图片", "warn", 2500);
                return;
            }
            this.selectedFile = event.target.files[0];
            this.imageName = this.selectedFile.name;
        },
        async handleSubmit(event) {
            // 阻止默认的提交行为
            event.preventDefault();

            // 获取表单数据
            const formData = new FormData(event.target);

            try {
                // 发起 POST 请求
                const response = await axios.post("/publish", formData);

                // 处理请求成功的响应
                aotolog.log("发布成功", "success", 2500);
                this.$parent.cutWritePanel()
            } catch (error) {
                // 处理请求失败的情况
                console.error("Error:", error);
                aotolog.log("发布失败", "success", 2500);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/write.scss";
</style>
