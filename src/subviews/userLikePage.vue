<template>
    <div class="articlePage">
        <card v-for="(pid, index) in post" :key="pid" :post="post[index]" />
        <div class="loading" ref="loading">
            <div class="spinner center" ref="loadingIcon" v-if="!message">
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
                <div class="spinner-blade"></div>
            </div>
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script>
import card from "@/components/windows/card.vue";
import { postStore } from "@/stores/post.js";

export default {
    props: ["uid"],
    components: {
        card,
    },
    data() {
        const post = postStore();
        return {
            handlePost: post,
            accessToken: localStorage.getItem("accessToken"),
            page: 1,
            pageSize: 5,
            post: [],
            newPost: [],
            message: "",
        };
    },
    methods: {
        async getUserLike() {
            try {
                await this.handlePost.getUserLike(this.accessToken, { uid: this.uid, page: this.page, pageSize: this.pageSize });
                this.newPost = this.handlePost.postList;
                if (this.newPost.length > 0) {
                    this.post = [...this.post, ...this.newPost];
                    this.page++;
                } else {
                    this.message = "没有更多帖子了";
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        this.getUserLike();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.getUserLike();
                }
            });
        });

        setTimeout(() => {
            observer.observe(this.$refs.loadingIcon);
        }, 1000);
    },
};
</script>

<style lang="scss" scoped>
.loading {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;
    position: relative;
    span {
        margin: 20px;
    }
    img {
        position: absolute;
        right: 0;
        bottom: 0;
    }
    .spinner {
        font-size: 28px;
        position: relative;
        display: inline-block;
        width: 1em;
        height: 1em;
    }
    .spinner .spinner-blade {
        position: absolute;
        left: 0.4629em;
        bottom: 0;
        width: 0.074em;
        height: 0.2777em;
        border-radius: 0.0555em;
        background-color: transparent;
        -webkit-transform-origin: center -0.2222em;
        -ms-transform-origin: center -0.2222em;
        transform-origin: center -0.2222em;
        animation: spinner-fade9234 1s infinite linear;
    }

    .spinner .spinner-blade:nth-child(1) {
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    .spinner .spinner-blade:nth-child(2) {
        -webkit-animation-delay: 0.083s;
        animation-delay: 0.083s;
        -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
        transform: rotate(30deg);
    }

    .spinner .spinner-blade:nth-child(3) {
        -webkit-animation-delay: 0.166s;
        animation-delay: 0.166s;
        -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
        transform: rotate(60deg);
    }

    .spinner .spinner-blade:nth-child(4) {
        -webkit-animation-delay: 0.249s;
        animation-delay: 0.249s;
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    .spinner .spinner-blade:nth-child(5) {
        -webkit-animation-delay: 0.332s;
        animation-delay: 0.332s;
        -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
        transform: rotate(120deg);
    }

    .spinner .spinner-blade:nth-child(6) {
        -webkit-animation-delay: 0.415s;
        animation-delay: 0.415s;
        -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
        transform: rotate(150deg);
    }

    .spinner .spinner-blade:nth-child(7) {
        -webkit-animation-delay: 0.498s;
        animation-delay: 0.498s;
        -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .spinner .spinner-blade:nth-child(8) {
        -webkit-animation-delay: 0.581s;
        animation-delay: 0.581s;
        -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
        transform: rotate(210deg);
    }

    .spinner .spinner-blade:nth-child(9) {
        -webkit-animation-delay: 0.664s;
        animation-delay: 0.664s;
        -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
        transform: rotate(240deg);
    }

    .spinner .spinner-blade:nth-child(10) {
        -webkit-animation-delay: 0.747s;
        animation-delay: 0.747s;
        -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
        transform: rotate(270deg);
    }

    .spinner .spinner-blade:nth-child(11) {
        -webkit-animation-delay: 0.83s;
        animation-delay: 0.83s;
        -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
        transform: rotate(300deg);
    }

    .spinner .spinner-blade:nth-child(12) {
        -webkit-animation-delay: 0.913s;
        animation-delay: 0.913s;
        -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
        transform: rotate(330deg);
    }

    @keyframes spinner-fade9234 {
        0% {
            background-color: #69717d;
        }

        100% {
            background-color: transparent;
        }
    }
}
</style>

