<template>
    <div class="task-procedure">
        <mt-header fixed title="任务流程">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="task-procedure-content" v-html="procedureContent">

        </div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "task_procedure",
        data(){
            return {
                errorType:'',
                procedureContent:''
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
            this.renderprocedureData();
        },

        methods: {
            // 渲染数据流程
            renderprocedureData() {
                this.getprocedureData().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.procedureContent =  res.data[0].content;
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

            // 获取任务流程
            getprocedureData() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get('api/article/detail/4')
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
    .task-procedure-content {
        max-width: 7.5rem;
        margin-top: .9rem;
        padding: .4rem;
        background-color: #fff;
        img {
            width: 100% !important;
        }
    }
</style>
