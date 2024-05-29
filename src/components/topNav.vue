<template>
    <nav class="topNav">
        <div class="menu">
            <svg class="icon back" aria-hidden="true" @click="$router.back()" v-if="show">
                <use xlink:href="#arrow-back"></use>
            </svg>
            <div class="title" v-if="!subTitle">
                <span>{{ title }}</span>
            </div>
            <div class="subTitle" v-else>
                <span>{{ title }}</span>
                <p>{{ subTitle }}</p>
            </div>
        </div>
        <div class="search">
            <input type="text" />
        </div>
    </nav>
</template>

<script>
export default {
    props: ["title", "subTitle", "show"],
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/components/topNav.scss";
</style>
