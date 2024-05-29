import { defineStore } from "pinia";
import axios from "axios";

export const emailStore = defineStore({
    id: "email",
    store: () => {
        return {
            message: null,
            isSend: false,
        };
    },
    actions: {
        // 邮箱
        async email({ email }) {
            try {
                const res = await axios.post("/sendCode", { email });
                if (res.data.code === 0) {
                    this.message = res.data.message;
                    return;
                }

                this.message = res.data.message;
                this.isSend = true;
            } catch (error) {
                this.message = error.response.data.message;
            }
        },
    },
});
