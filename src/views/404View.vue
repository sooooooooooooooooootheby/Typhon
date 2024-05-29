<template>
    <div class="notFound">
        <div class="title">
            <span>Oops!</span>
            <p>It looks like we have a bit of a problem.</p>
            <router-link to="/">Click back to the home page</router-link>
        </div>
        <div class="img">
            <img src="@/assets/image/NotFound.png" alt="" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.notFound {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: url(@/assets/image/NotFoundBG.svg) no-repeat;
    background-position: center;
    background-size: cover;
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        span, p, a {
            color: #ffffff;
        }
        span {
            font-size: 80px;
            font-weight: bold;
        }
        p {
            font-size: 24px;
        }
    }
    .img {
        width: 600px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
