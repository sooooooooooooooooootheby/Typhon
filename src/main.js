import "./assets/css/main.scss";
// iconfont 图标包
import "//at.alicdn.com/t/c/font_4516886_7n22gn2p8e.js";
// 国家旗帜
import "//at.alicdn.com/t/c/font_4595004_n1bscyrodc.js";

import { createApp } from "vue";
import { createPinia } from "pinia";
import VueLazyload from "vue-lazyload";
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import i18n from '@/i18n/i18n.js'

VMdEditor.use(vuepressTheme, {
    Prism,
});

import App from "./App.vue";
import router from "./router";
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:4000/api";

const app = createApp(App);

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

app.use(createPinia());
app.use(router);
app.use(VueLazyload);
app.use(VMdEditor);
app.use(i18n);

app.mount("#app");
