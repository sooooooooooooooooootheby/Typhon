<template>
    <div class="searchPage">
        <div class="search">
            搜索
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
@import '@/assets/css/subviews/searchPage.scss';
</style>