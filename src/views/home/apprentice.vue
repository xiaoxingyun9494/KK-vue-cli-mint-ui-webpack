<template>
    <div>
        <mt-header fixed title="我的徒弟">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
            <!-- <router-link to="/how_to_apprentice"> -->
                <mt-button @click="handleHow" slot="right">
                    <span class="kk-icon-how"></span>
                </mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="kk-apprentice-header">
            <div class="apprentice-header-left">
                <h3 class="header-left-title">收徒人数</h3>
                <span class="header-left-amount" v-text="apprenticeAmount">6</span><span>人</span>
            </div>
            <div class="apprentice-header-right">
                <h3 class="header-right-title">提成奖励</h3>
                <span class="header-right-amount" v-text="moneyAmount">66</span><span>元</span>
            </div>
        </div>
        <div class="apprentice-list-content">
             <mt-cell v-for="(item,i) in apprenticeList" :key="i" :title="item.user_name">
                <img slot="icon" :src="item.avatar" width="24" height="24">
            </mt-cell>
            <kkError v-show="isError" :type="errorType"></kkError>
        </div>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "apprentice",
        data(){
            return {
                userId:'',
                apprenticeList:[],
                errorType:'',
                apprenticeAmount:this.$route.query.subCount,
                moneyAmount:this.$route.query.subMoney
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
            this.initData();
        },

        methods: {
            initData() {
                this.kkzStates = this.$storage().get('kkzStates') || {};
                this.userId = this.kkzStates.userId;
                this.renderApprenticedata()
            },

            // 渲染徒弟数据
            renderApprenticedata() {
                this.getApprenticedata().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.apprenticeList =  res.data.data;
                        if (this.apprenticeList.length == 0) {
                            this.errorType = 'noApprentice';
                        }
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

            // 获取徒弟数据
            getApprenticedata() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`/api/user/sub/${this.userId}`)
                .catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 返回上一页
            handleBack() {
                window.history.go(-1);
            },

            handleHow() {
                this.$router.push({ path: '/how_to_apprentice'});
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/scss/variable';
    .kk-icon-how {
        font-size: .45rem;
        color: #fff;
    }
    .kk-icon-how:before {
        content: "\e64a";
    }
    .kk-apprentice-header {
        margin-top: .9rem;
        height: 2rem;
        background-color: $mainColor;
        color: #fff;
        padding-top: .5rem;
        position:relative;
        &:before {
            content:'';
            width: 2px;
            height: 60%;
            background-color: #fff;
            position:absolute;
            top: 25%;
            left:50%;
        }
        .apprentice-header-left, .apprentice-header-right {
            width: 50%;
            height: 100%;
            float: left;
            text-align: center;
            .header-left-title, .header-right-title {
                font-size: .28rem;
            }
            .header-left-amount, .header-right-amount {
                font-size: .28rem;
                line-height: 1rem;
            }
        }

    }
    .apprentice-list-content {
        position: relative;
    }
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
    .kk-icon-data:before {
        font-size: 120px;
        content: '\e601';
    }

</style>
