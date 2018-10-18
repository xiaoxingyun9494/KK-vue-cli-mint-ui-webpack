<template>
    <div>
        <mt-header fixed title="收益日报">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
                <mt-button slot="right">
                    <router-link to="/income_chart">
                        <span class="kk-icon-chart"></span>
                    </router-link>
                </mt-button>
        </mt-header>
        <div class="income-content">
            <div class="income-title">
                <span class="income-date">日期</span>
                <span class="income-amount">收入</span>
            </div>

            <mt-loadmore
                    :top-method="loadTop"
                    @top-status-change="handleTopChange"
                    :bottom-method="loadBottom"
                    @bottom-status-change="handleBottomChange"
                    :bottom-all-loaded="allLoaded" ref="loadmore"
            >
                <ul class="income-content-list">
                    <li class="content-list-item" v-for="(item,i) in incomeList" >
                        <span class="list-date" v-text="item.day"></span>
                        <span class="list-income" v-text="'+' + item.amount"></span>
                    </li>
                </ul>

               <div slot="top" class="mint-loadmore-top">
                    <span v-text="topContent" v-show="!showTopLoad"></span>
                    <span v-show="showTopLoad">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                </div>

                <div slot="bottom" class="mint-loadmore-bottom">
                    <span v-text="bottomContent" v-show="!showBottomLoad"></span>
                    <span v-show="showBottomLoad">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                </div>
            </mt-loadmore>
            <span class="no-more-data" v-text="bottomContent" v-show="allLoaded"></span>
        </div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        name: "income",
        data(){
            return {
                incomeList:[],
                userId: '',
                errorType:'',
                allLoaded: false,
                wrapperHeight: 0,
                translate: 0,
                moveTranslate: 0,
                currentPage:1,
                topContent:'',
                showTopLoad:'',
                showBottomLoad:'',
                bottomContent:''
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
                this.renderIncomedata();
            },

            // 渲染收入数据
            renderIncomedata() {
                this.getIncomeData().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.incomeList = res.data.data;

                        var result = res.data;
                        if (this.currentPage == 1) {
                            this.incomeList = [];
                        };
                        if (result.next_page_url !=  null) {
                            this.currentPage = result.current_page + 1;
                            this.allLoaded = false;
                        }else {
                            this.currentPage = result.current_page;
                            this.allLoaded = true;
                            this.bottomContent = '没有更多数据了'
                        }
                        this.$nextTick(() => {
                            this.incomeList = this.incomeList.concat(result.data);
                            if (this.incomeList.length <= 0) {
                                this.errorType = 'data';
                            }else {
                                this.errorType = '';
                            }
                        });

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

            // 获取收入数据
            getIncomeData() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/user/dayRecord/${this.userId}`,{
                    params: {
                        page:this.currentPage
                    }
                }
                ).catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 上拉加载状态改变
            handleBottomChange(status) {
                switch (status) {
                    case 'pull':
                        this.showBottomLoad = false;
                        this.bottomContent = '上拉加载↑';
                        break;
                    case 'drop':
                        this.bottomContent = '释放加载↓';
                        break;
                    case 'loading':
                        this.showBottomLoad = true;
                        break;
                };
            },

            // 上拉加载事件
            loadBottom(done) {
                setTimeout(()=>{
                    this.renderIncomedata(done);
                    this.$refs.loadmore.onBottomLoaded();
                }, 1000)

            },

            // 下拉刷新状态改变
            handleTopChange(status) {
                switch (status) {
                    case 'pull':
                        this.showTopLoad = false;
                        this.topContent = '下拉刷新↑';
                        break;
                    case 'drop':
                        this.topContent = '释放刷新↓';
                        break;
                    case 'loading':
                        this.showTopLoad = true;
                        break;
                };
            },

            // 下拉刷新事件
            loadTop(done) {
                this.currentPage = 1;
                setTimeout(()=>{
                    this.renderIncomedata(done);
                    this.$refs.loadmore.onTopLoaded();
                }, 1000)
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
    .kk-icon-chart {
        font-size: .52rem;
        color: #fff;
    }
    .kk-icon-chart:before {
        content: "\e698";
    }
    .income-content {
        font-size: .28rem;
        margin-top: .9rem;
        .income-title {
            background-color: #EEEEEE;
            .income-date, .income-amount {
                display: inline-block;
                width: 49%;
                text-align: center;
                padding-left: .2rem;
                height: .8rem;
                line-height: .8rem;
            }
            .income-amount {
                border-left: 1px solid #ccc;
            }
        }
        .no-more-data {
            display: block;
            width: 100%;
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            font-size: .28rem;
            color: #ff9900;
        }
    }
    .income-content-list {

        .content-list-item {
            height: .8rem;
            line-height: .8rem;
            padding-left: .2rem;
            border-bottom: 1px solid #EEEEEE;
            .list-date, .list-income {
                width: 49%;
                display: inline-block;
                text-align: center;
            }
            .list-income {
                color: red;
                font-size: .32rem;
            }
        }
    }

</style>
