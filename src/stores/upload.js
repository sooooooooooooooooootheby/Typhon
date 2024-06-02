import { defineStore } from "pinia";
import axios from "axios";

export const uploadStore = defineStore({
    id: "upload",
    state: () => {
        return {
            message: null,
            code: null,
            coverUrl: null,
            headUrl: null,
        };
    },
    actions: {
        // 图片上传
        async uploadImage({ token, imageType, imageUrl }) {
            try {
                const res = await axios.post(
                    "/uploadImage",
                    {
                        imageType,
                        imageUrl,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                this.message = res.data.message;
            } catch (err) {
                console.log(err);
            }
        },
        // 用户封面上传
        async uploadUserInfo_image({ token, imageInfo, imageType }) {
            try {
                const res = await axios.post(
                    "/uploadUserInfo_image",
                    {
                        imageInfo,
                        imageType,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return (this.message = res.data.message);
                }

                if (imageType === "userCover") {
                    this.coverUrl = res.data.url;
                } else if (imageType === "userHead") {
                    this.headUrl = res.data.url;
                }
            } catch (err) {
                console.log(err);
            }
        },
    },
});
