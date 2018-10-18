<template>
    <div>
        <mt-header fixed title="常见问题">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="msg-list-content">
            <mt-cell v-for="(item,i) in msgList" :key="i" :title="item.title" :to="{path:'/msg_detail',query:{articleId:item.id}}" is-link></mt-cell>
        </div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "msg",
        data(){
            return {
                msgList:[],
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
            this.renderMsglist();
        },

        methods: {
            // 渲染问题列表
            renderMsglist() {
                this.getMsglist().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.msgList =  res.data.data;
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

            // 获取问题列表
            getMsglist() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/article/lists/${1}`)
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
<style lang="scss">
    @import '../../style/scss/variable';
    .msg-list-content {
        margin-top: .9rem;
    }
</style>
