import { defineStore } from "pinia";
import axios from "axios";

export const emailStore = defineStore({
    id: "email",
    store: () => {
        return {
            message: null,
            code: null,
        };
    },
    actions: {
        // 邮箱
        async sendEmail({ email }) {
            try {
                const res = await axios.post("/sendEmail", { email });
                if (res.data.code === 0) {
                    this.code = res.data.code;
                    return this.message = res.data.message;
                }
                this.code = res.data.code;
                this.message = res.data.message;
            } catch (error) {
                this.message = error.response.data.message;
            }
        },
    },
});
