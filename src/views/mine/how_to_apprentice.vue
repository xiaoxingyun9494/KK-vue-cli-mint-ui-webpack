<template>
    <div>
        <mt-header fixed title="如何收徒">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="how-to-content" v-html="howtoText[0] ? howtoText[0].content : null"></div>
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
                howtoText:[]

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
            this.renderHowtotext();
        },

        methods: {


            // 渲染收徒规则
            renderHowtotext() {
                this.getHowtotext().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.howtoText =  res.data;
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

            // 获取如何收徒规则
            getHowtotext() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get('api/article/detail/5')
                .catch(err => {

                })
            },

            // 返回上一页
            handleBack() {
                window.history.go(-1);
            },


        }
    };
</script>
<style lang="scss">
  @import '../../style/scss/variable';
  .how-to-content {
    margin-top: .9rem;
    padding: .2rem;
  }
</style>
