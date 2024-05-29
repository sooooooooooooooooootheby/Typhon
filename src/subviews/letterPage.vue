<template>
    <div class="letterPage">
        <div class="letter">
            私信
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
@import '@/assets/css/subviews/letterPage.scss';
</style>