<template>
    <div>
        <mt-header fixed title="今日任务">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
            <mt-button slot="right">
                <router-link to="/task_record">
                    <span class="kk-icon-recor"></span>
                </router-link>
            </mt-button>
        </mt-header>
        <div class="task-list-content" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
            <mt-loadmore
                    :top-method="loadTop"
                    @top-status-change="handleTopChange"
                    :bottom-method="loadBottom"
                    @bottom-status-change="handleBottomChange"
                    :bottom-all-loaded="allLoaded" ref="loadmore"
            >
                <mt-cell v-for="(item,i) in taskList" :key="i" :title="item.mission_title" :to="{path:'/task_detail',query:{missionId:item.id,mission_title:item.mission_title,amount:item.amount,thumb:item.thumb}}" is-link>
                    <img slot="icon" src="../../assets/timg.jpg">
                    <span>预计收益<span class="task-amount" v-text="item.amount"></span>元</span>
                </mt-cell>

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
        name: "task_list",

        data(){
            return {
                taskList:[],
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

        mounted() {
          this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },

        created() {
            this.initRendertasklist();
        },

        methods: {
            // 初始化任务列表
            initRendertasklist() {
                this.currentPage = 1;
                this.renderTasklist();
            },

            // 渲染任务列表
            renderTasklist(done) {
                this.getTasklist().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        var result = res.data;
                        if (this.currentPage == 1) {
                            this.taskList = [];
                        };

                        if (result.next_page_url !=  null) {
                            this.currentPage = result.current_page + 1;
                            this.allLoaded = false;
                        }else {
                            this.currentPage = result.current_page;
                            this.allLoaded = true;
                            this.bottomContent = '没有数据了'
                        }

                        this.$nextTick(() => {
                            this.taskList = this.taskList.concat(result.data);
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
                    if (done) done();
                    Indicator.close();
                })
            },


            // 获取任务列表
            getTasklist() {
                return this.$http.before(() => {
                    if (this.currentPage == 1) {
                        Indicator.open({
                            spinnerType: 'triple-bounce'
                        });
                    }
                }).get(`api/mission/lists`,{
                    params: {
                        page:this.currentPage
                    }
                }).catch(err => {
                    Indicator.close();
                    this.showBottomLoad = false;
                    this.bottomContent = err == 0 ? '网络出现异常~~' : '系统正在维护~~';
                    this.errorType = err == 0 ? 'link' : 'server';
                });
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
                    this.renderTasklist(done);
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
                    this.renderTasklist(done);
                    this.$refs.loadmore.onTopLoaded();
                }, 1000)
            },

            handleBack() {
                window.history.back();
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/scss/variable';
    body {
        background-color:#fff;
    }
    .kk-icon-recor {
        font-size: .45rem;
        color: #fff;
    }
    .kk-icon-recor:before {
        content: "\e606";
    }
    .task-list-content {
        padding-top: .9rem;
        .task-amount {
            font-size: .32rem;
            color: $mainColor;
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
</style>
