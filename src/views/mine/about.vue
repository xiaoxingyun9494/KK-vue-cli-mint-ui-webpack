<template>
    <div class="about">
        <mt-header fixed title="关于我们">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="about-content" v-html="aboutContent"></div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "about",
        data(){
            return {
                errorType:'',
                aboutContent:''
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
            this.renderAboutdata();
        },

        methods: {

            // 渲染关于我们数据
            renderAboutdata() {
                this.getAboutdata().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.aboutContent = res.data[0].content;
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

            // 获取关于我们数据
            getAboutdata() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get('api/article/detail/2')
                .catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 点击返回上一页
            handleBack() {
                window.history.go(-1);
            }
        }
    };
</script>
<style lang="scss">
  @import '../../style/scss/variable';
    .about-content {
        margin-top: 2rem;
        padding: .2rem;
    }
</style>
