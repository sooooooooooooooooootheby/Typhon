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
                    <input type="file" accept="image/*" v-on:change="onFileimage" name="image" class="coverButton" id="cover" />
                    <input type="hidden" name="uid" :value="handleUser.userInfo.uid" />
                    <input type="hidden" name="content" :value="text" />
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
import { uploadStore } from "@/stores/upload.js";
import aotolog from "autolog.js";
import axios from "axios";

export default {
    data() {
        const user = userStore();
        const post = postStore();
        const upload = uploadStore();
        return {
            handleUser: user,
            handlePost: post,
            handleUpload: upload,
            text: "",
            imageName: "",
            imageUrl: "",
            accessToken: localStorage.getItem("accessToken"),
            imageType: "postCover",
        };
    },
    methods: {
        onFileimage(event) {
            const file = event.target.files[0];
            if (file.size > 5000000) {
                aotolog.log("图片过大，请上传小于5mb的图片", "warn", 2500);
                return;
            }
            this.imageName = file.name;
            // 将图片转换成base64格式
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        async handleSubmit(event) {
            // 阻止默认的提交行为
            event.preventDefault();

            // 获取表单数据
            const formData = new FormData(event.target);

            const image = formData.get("image");
            const content = formData.get("content");
            const formImageData = new FormData();
            formImageData.append("image", image);
            formImageData.append("imageType", this.imageType);
            if (image.size > 0) {
                try {
                    const res = await axios.post("/uploadImage", formImageData, {
                        headers: {
                            Authorization: `Bearer ${this.accessToken}`,
                        },
                    });

                    try {
                        await this.handlePost.publishPost({ token: this.accessToken, cover: res.data.url, content: content });

                        if (!this.handlePost.code === 0) {
                            this.handlePost.code = null;
                            return aotolog.log(this.handlePost.message, "error", this.logTimeout);
                        }

                        aotolog.log(this.handlePost.message, "success", 2500);
                    } catch (err) {
                        console.log(err);
                    }
                } catch (err) {
                    console.log(err);
                }
                return;
            }
            try {
                await this.handlePost.publishPost({ token: this.accessToken, content: content });

                aotolog.log(this.handlePost.message, "success", 2500);
            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/write.scss";
</style>
