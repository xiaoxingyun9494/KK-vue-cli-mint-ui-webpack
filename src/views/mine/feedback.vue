<template>
    <div class="feedback">
        <mt-header fixed title="问题反馈">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
       <!--  <mt-field label="标题" placeholder="请输入标题(10个字以内)：" type="text" rows="1" :attr="{ maxlength: 20 }" v-model="feedbackTitle"></mt-field> -->
        <mt-field label="反馈" placeholder="请输入你的问题或者建议(100个字以内)：" type="textarea" rows="8" :attr="{ maxlength: 100 }" v-model="feedbackContent"></mt-field>
        <button class="feedback_submit_btn" @click="handelFeedback">提交反馈</button>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "feedback",
        data(){
            return {
                errorType:'',
                feedbackContent:'',
                userId:''
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

        methods: {
            // 上传结束
            feedbackEnd() {
                this.getfeedbackData().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        Toast({
                            message: '反馈成功！',
                            duration:2000,
                            iconClass: 'kk-icon-success'
                        });
                        this.feedbackContent = '';
                    }
                    else {
                        Toast({
                            message: res.message,
                            duration:2000,
                            iconClass: 'kk-icon-fail'
                        });
                    };
                    Indicator.close();
                })
            },

            // 获取反馈信息上传
            getfeedbackData() {
                return this.$http.before(() => {
                    Indicator.open({
                        text:'正在反馈',
                        spinnerType: 'triple-bounce'
                    });
                }).post('api/user/advice',{
                    content:this.feedbackContent,
                    userId:this.userId
                }).catch(err => {
                    Indicator.close();
                    Toast({
                        message: '反馈失败！',
                        duration:2000,
                        iconClass: 'kk-icon-fail'
                    });
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 点击发送反馈
            handelFeedback() {
                if (this.feedbackContent.length != 0) {
                    this.kkzStates = this.$storage().get('kkzStates') || {};
                    this.userId = this.kkzStates.userId;
                    this.feedbackEnd();
                }else {
                    Toast({
                        message: '内容不能为空！',
                        duration:2000,
                        iconClass: 'kk-icon-fail'
                    });
                }

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
    .feedback {

    }
  .feedback_submit_btn {
    width: 80%;
    height: .8rem;
    max-width: 6rem;
    line-height: .8rem;
    color: #fff;
    font-size: .32rem;
    margin-top: 1rem;
    background-color: red;
    border-radius: .2rem;
    position: absolute;
    left: 50%;
    transform:translateX(-50%);
  }
</style>
