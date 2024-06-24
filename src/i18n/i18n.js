import { createI18n } from "vue-i18n";
import navZh from "@/i18n/nav/zh.json";
import navEn from "@/i18n/nav/en.json";
import postZh from "@/i18n/post/zh.json";
import postEn from "@/i18n/post/en.json";
import footerZh from "@/i18n/footer/zh.json";
import footerEn from "@/i18n/footer/en.json";
import userZh from "@/i18n/user/zh.json";
import userEn from "@/i18n/user/en.json";
import settingZh from "@/i18n/setting/zh.json";
import settingEn from "@/i18n/setting/en.json";

const messages = {
    zh: {
        ...navZh,
        ...postZh,
        ...footerZh,
        ...userZh,
        ...settingZh,
    },
    en: {
        ...navEn,
        ...postEn,
        ...footerEn,
        ...userEn,
        ...settingEn,
    },
};

let language = localStorage.getItem("locale");

if (!language) {
    language = "en";
}

const i18n = createI18n({
    legacy: false,
    locale: language,
    messages,
});

export default i18n;
