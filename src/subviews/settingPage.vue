<template>
    <div class="settingPage">
        <div class="setting">
            设置
        </div>
        <sideFooter />
    </div>
</template>

<script>
import sideFooter from "@/components/sideFooter.vue";

export default {
    components: {
        sideFooter,
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/subviews/settingPage.scss';
</style>