<template>
    <div class="kk-error">
        <div class="kk-image-icon" :class="`kk-icon-${type}`" @click="handleRefresh"></div>
        <p class="kk-error-text" v-text="errorText" @click="handleRefresh"></p>
    </div>
</template>

<style lang="scss">
    @import '../style/scss/variable';

    .kk-error {
        width: 100%;
        height: 100%;
        background-color: #fff;
        padding: 30% 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index:99;
    }
    .kk-image-icon {
        width: 100%;
        line-height: 1;
        color: #bcbcbc;
        text-align: center;
        letter-spacing: 1px;
    }
    .kk-icon-link:before {
        font-size: 115px;
        content: '\e69d';
    }
    .kk-icon-data:before {
        font-size: 120px;
        content: '\e601';
    }
    .kk-icon-server:before {
        font-size: 120px;
        content: '\e635';
    }
    .kk-icon-noApprentice:before {
        font-size: 120px;
        content: '\e612';
    }
    .kk-error-text {
        line-height: 2;
        font-size: .32rem;
        color: #999;
        text-align: center;
        margin-top: .5rem;
    }
</style>

<script>
    export default {
        name: 'error',

        props: {
            type: {
                type: String,
                default: 'data'
            },
            text: String
        },

        plusReady() {
            //当前webview
            this.webview = plus.webview.currentWebview();
        },

        computed: {
            errorText() {
                if (this.text) {
                    return this.text;
                }
                else {
                    switch (this.type) {
                        case 'link':
                            return '网络出现异常,轻敲可刷新!';
                        case 'data':
                            return '暂无数据查看!';
                        case 'server':
                            return '系统正在维护中,轻敲可刷新!';
                        case 'noApprentice':
                            return '暂无徒弟，快去收徒吧！'
                    };
                };
            }
        },

        methods: {
            handleRefresh() {
                if (this.type === 'link' || this.type === 'server') {
                    if (this.webview) {
                        return this.webview.reload();
                    };
                    location.reload();
                }
            }
        }
    };
</script>
