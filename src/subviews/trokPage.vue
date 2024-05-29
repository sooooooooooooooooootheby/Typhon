<template>
    <div class="trokPage">
        <div class="trok">
            Trok
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
@import '@/assets/css/subviews/trokPage.scss';
</style>