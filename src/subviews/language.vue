<template>
    <div class="title">{{ $t("language.title") }}</div>
    <div class="language">
        <ul>
            <li>
                <span class="subTitle">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#text"></use>
                    </svg>
                    {{ $t("language.display.title") }}
                </span>
                <ul class="displayLanguage">
                    <li @click="cutLanguage('zh')" :class="{ select: zhSelected }">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#zh"></use>
                        </svg>
                        <span>简体中文</span>
                    </li>
                    <li @click="cutLanguage('en')" :class="{ select: enSelected }">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#en"></use>
                        </svg>
                        <span>English (Machine translation & incomplete warnings)</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            zhSelected: false,
            enSelected: false,
        };
    },
    methods: {
        cutLanguage(language) {
            localStorage.setItem("locale", language);
            this.$i18n.locale = language;
            this.zhSelected = language === "zh";
            this.enSelected = language === "en";
        },
    },
    mounted() {
        switch (this.$i18n.locale) {
            case "zh":
                this.zhSelected = true;
                break;
            case "en":
                this.enSelected = true;
                break;
            default:
                break;
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/subviews/language.scss";
</style>
