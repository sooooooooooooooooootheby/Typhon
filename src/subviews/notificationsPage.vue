<template>
    <div class="notificationsPage">
        <div class="notifications">
            通知
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
@import '@/assets/css/subviews/notificationsPage.scss';
</style>