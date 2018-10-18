<template>
    <div>
        <mt-header fixed title="问题详情">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="msg-content" v-html="msgContent"></div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "msg_detail",
        data(){
            return {
                articleId: this.$route.query.articleId,
                msgContent:'',
                errorType:''
            }
        },

        components: {
            kkError
        },

        computed: {
            isError() {
                return this.errorType.length > 0 ? true : false;
            }
        },

        created() {
            this.renderMsgdetail();
        },

        methods: {
            // 渲染问题详情
            renderMsgdetail() {
                this.getMsgdetail().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.msgContent =  res.data[0].content;
                        console.log(this.msgContent)
                    }
                    else {
                        Toast({
                            message: res.message,
                            duration:2000,
                            iconClass: 'kk-icon-fail'
                        });
                        this.errorType = 'data';
                    };
                    Indicator.close();
                })
            },

            // 获取问题详情
            getMsgdetail() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/article/detail/${this.articleId}`)
                .catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 返回上一页
            handleBack() {
                window.history.go(-1);
            }
        }
    };
</script>
<style lang="scss" scoped>
  @import '../../style/scss/variable';
    .msg-content {
        margin-top: .9rem;
    }
</style>
