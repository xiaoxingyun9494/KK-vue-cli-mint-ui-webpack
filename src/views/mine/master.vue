<template>
    <div>
        <mt-header fixed title="我的师傅">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="my-master">
            <input class="master-code" type="text" v-model="masterCode" name="masterCode" placeholder="请输入师傅码" maxlength="6">
            <button class="master-btn" @click="handelApprentice">马上拜师</button>
        </div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import kkError from '../../components/error'
    export default {
        name: "master",
        data(){
            return {
                masterCode:'',
                errorType:'',
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

        created() {

        },

        methods: {
            // 拜师结果
            renderPostapprentice() {
                this.postApprentice().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        Toast({
                            message: '拜师成功！',
                            duration:2000,
                            iconClass: 'kk-icon-success'
                        });
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

            // 拜师
            postApprentice() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/user/beSub/${this.userId}`,{
                    params: {
                        code:this.masterCode
                    }
                }).catch(err => {
                    console.log(err)
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 点击拜师
            handelApprentice() {
                if (this.masterCode.length > 0) {
                    this.kkzStates = this.$storage().get('kkzStates') || {};
                    this.userId = this.kkzStates.userId;
                    this.renderPostapprentice();
                }else {
                    Toast({
                        message: '师傅码不能为空！',
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
    .my-master {
        margin-top: .9rem;
        .master-code {
            border: 1px solid #ccc;
            width: 80%;
            height: .8rem;
            line-height: .8rem;
            border-radius: .2rem;
            padding-left: .2rem;
            font-size: .28rem;
            margin-left: 10%;
            margin-top: .5rem;
        }
        .master-btn {
            width: 80%;
            height: .8rem;
            line-height: .8rem;
            color: #fff;
            font-size: .32rem;
            background-color: red;
            border: 1px solid red;
            border-radius: .2rem;
            margin-left: 10%;
            margin-top: .5rem;
        }
    }
</style>
