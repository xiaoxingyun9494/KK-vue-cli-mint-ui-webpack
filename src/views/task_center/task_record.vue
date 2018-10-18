<template>
    <div>
        <mt-header fixed title="任务记录">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <mt-navbar v-model="selected">
            <mt-tab-item id="0">进行中</mt-tab-item>
            <mt-tab-item id="3">待审核</mt-tab-item>
            <mt-tab-item id="1">已发奖</mt-tab-item>
            <mt-tab-item id="-1">未通过</mt-tab-item>
            <mt-tab-item id="2">已放弃</mt-tab-item>
        </mt-navbar>
        <div class="task-record-content">
            <mt-loadmore
                    :top-method="loadTop"
                    @top-status-change="handleTopChange"
                    :bottom-method="loadBottom"
                    @bottom-status-change="handleBottomChange"
                    :bottom-all-loaded="allLoaded" ref="loadmore"
            >
                <!-- <mt-tab-container-item id="3"> -->
                    <mt-cell v-for="(item,i) in taskStatuslist" :title="item.title" :key='i'>
                        <span style="color: green" v-text="item.remark"></span>
                    </mt-cell>
                <!-- </mt-tab-container-item> -->

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

        <!-- tab-container -->
        <!-- <mt-tab-container v-model="selected">
            <mt-tab-container-item id="0">
                <mt-cell v-for="(item,i) in taskStatuslist" :title="item.title" :key='i'>
                    <span style="color: green" v-text="item.remark"></span>
                </mt-cell>
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
                <mt-cell v-for="(item,i) in taskStatuslist" :title="item.title" :key='i'>
                    <span style="color: green" v-text="item.remark"></span>
                </mt-cell>
            </mt-tab-container-item>
            <mt-tab-container-item id="1">
                <mt-cell v-for="(item,i) in taskStatuslist" :title="item.title" :key='i'>
                    <span style="color: green" v-text="item.remark"></span>
                </mt-cell>
            </mt-tab-container-item>
            <mt-tab-container-item id="-1">
                <mt-cell v-for="(item,i) in taskStatuslist" :title="item.title" :key='i'>
                    <span style="color: green" v-text="item.remark"></span>
                </mt-cell>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <mt-cell v-for="(item,i) in taskStatuslist" :title="item.title"   :key='i'>
                    <span style="color: green" v-text="item.remark"></span>
                </mt-cell>
            </mt-tab-container-item>
        </mt-tab-container> -->
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error'
    export default {
        name: "task_record",
        data(){
            return {
                userId:'',
                selected: '0',
                errorType:'',
                taskStatuslist: [],
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

        watch: {
            selected: function() {
                this.currentPage = 1;
                this.renderTaskstatus();
            }
        },

        created() {
            this.initData();
        },

        methods: {
            initData() {
                this.kkzStates = this.$storage().get('kkzStates') || {};
                this.userId = this.kkzStates.userId;
                this.currentPage = 1;
                this.renderTaskstatus();
            },

            // 渲染任务状态列表
            renderTaskstatus() {
                this.errorType = '';
                this.getTaskstatus().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        var result = res.data;
                        if (this.currentPage == 1) {
                            this.taskStatuslist = [];
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
                            this.taskStatuslist = this.taskStatuslist.concat(result.data);
                            if (this.taskStatuslist.length <= 0) {
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

            // 获取获取任务状态
            getTaskstatus() {
                console.log(this.selected);
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/user/mission/${this.userId}`,{
                    params: {
                        status:this.selected,
                        page:this.currentPage
                    }
                }).catch(err => {
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
                    this.renderTaskstatus(done);
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
                    this.renderTaskstatus(done);
                    this.$refs.loadmore.onTopLoaded();
                }, 1000)
            },

            //返回上一页
            handleBack() {
                window.history.go(-1);
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/scss/variable';
    .kk-error {
        top: 2.1rem !important;
        height: auto !important;
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
