<template>
  <div class="page-loadmore">
    <!-- <h1 class="page-title">Pull up</h1>
    <p class="page-loadmore-desc">在列表底部, 按住 - 上拉 - 释放可以获取更多数据</p>
    <p class="page-loadmore-desc">translate : {{ translate }}</p>
    <div class="loading-background" :style="{ transform: 'scale3d(' + moveTranslate + ',' + moveTranslate + ',1)' }">
      translateScale : {{ moveTranslate }}
    </div> -->

    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore
                    :top-method="loadTop"
                    @translate-change="translateChange"
                    @top-status-change="handleTopChange"
                    :bottom-method="loadBottom"
                    @bottom-status-change="handleBottomChange"
                    :bottom-all-loaded="allLoaded" ref="loadmore"
        >

        <ul class="page-loadmore-list">
          <li v-for="item in list" class="page-loadmore-listitem">{{ item }}</li>
        </ul>


        <!-- <div class="task-list-content">
            <mt-cell v-for="(item,i) in taskList" :key="i" :title="item.mission_title" :to="{path:'/task_detail',query:{missionId:item.id,mission_title:item.mission_title,amount:item.amount,thumb:item.thumb}}" is-link>
                <img slot="icon" :src="item.thumb" width="24" height="24">
                <span>预计收益<span class="task-amount" v-text="item.amount"></span>元</span>
            </mt-cell>
        </div> -->
        <!-- <kkError v-show="isError" :type="errorType"></kkError> -->


       <div slot="top" class="mint-loadmore-top">
            <span v-text="topContent" v-show="!showTopLoad"></span>
            <span v-show="showTopLoad">
                <mt-spinner type="snake"></mt-spinner>
            </span>
            <span v-show="isError" v-text="erroText"></span>
        </div>


        <div slot="bottom" class="mint-loadmore-bottom">
            <span v-text="bottomContent" v-show="!showBottomLoad"></span>
            <span v-show="showBottomLoad">
                <mt-spinner type="snake"></mt-spinner>
            </span>
            <span v-show="isError" v-text="erroText"></span>
        </div>
        </mt-loadmore>

    </div>
  </div>
</template>

<style>
    .mint-loadmore {
        overflow: hidden;
    }
    .task-list-content {
        height: 100%;
        padding-bottom: .6rem;
        overflow: hidden;
    }
    .loading-background, .mint-loadmore-top span {
        -webkit-transition: .2s linear;
        transition: .2s linear
    }
    .mint-loadmore-top span {
        display: inline-block;
        vertical-align: middle;
        color: #ff9900;
    }

    .mint-loadmore-top span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg)
    }

    .page-loadmore .mint-spinner {
        display: inline-block;
        vertical-align: middle
    }

    .mint-spinner-snake {
        border-top-color: #ff9900 !important;
        border-left-color: #ff9900 !important;
        border-bottom-color: #ff9900 !important;
    }

    .page-loadmore-desc {
        text-align: center;
        color: #666;
        padding-bottom: 5px
    }

    .page-loadmore-desc:last-of-type,
    .page-loadmore-listitem {
        border-bottom: 1px solid #eee
    }

    .page-loadmore-listitem {
        height: 50px;
        line-height: 50px;
        text-align: center
    }

    .page-loadmore-listitem:first-child {
        border-top: 1px solid #eee
    }

    .page-loadmore-wrapper {
        overflow: scroll
    }

    .mint-loadmore-bottom span {
        display: inline-block;
        -webkit-transition: .2s linear;
        transition: .2s linear;
        vertical-align: middle
    }

    .mint-loadmore-bottom span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg)
    }
</style>

<script type="text/babel">
    import { Indicator } from 'mint-ui';
    import kkError from '../../components/error';
    import { Toast } from 'mint-ui';
    export default {
        data() {
            return {
                list: [],
                allLoaded: false,


                bottomStatus: '',
                wrapperHeight: 0,



                topStatus: '',
                wrapperHeight: 0,
                translate: 0,
                moveTranslate: 0,

                erroText:'',
                taskList:[],
                errorType:'',
                currentPage:1,
                topContent:'',
                showTopLoad:'',
                showBottomLoad:'',
                bottomContent:''


            };
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
            // this.initRendertasklist();

            for (let i = 1; i <= 20; i++) {
                this.list.push(i);
            }
        },

        methods: {

            initRendertasklist() {
                this.currentPage = 1;
                this.renderTasklist();
            },

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

            loadBottom(done) {
                console.log(1234)
                setTimeout(() => {
                    let lastValue = this.list[this.list.length - 1];
                    if (lastValue < 40) {
                        for (let i = 1; i <= 10; i++) {
                            this.list.push(lastValue + i);
                        }
                    } else {
                        this.allLoaded = true;
                    }
                    this.$refs.loadmore.onBottomLoaded();
                }, 1500);

                // setTimeout(()=>{
                //     this.renderTasklist(done);
                //     this.$refs.loadmore.onBottomLoaded();
                // }, 1000)

            },

            handleTopChange(status) {
                this.moveTranslate = 1;
                this.topStatus = status;
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

            translateChange(translate) {
                const translateNum = +translate;
                this.translate = translateNum.toFixed(2);
                this.moveTranslate = (1 + translateNum / 70).toFixed(2);
            },

            loadTop(done) {
                setTimeout(() => {
                    let firstValue = this.list[0];
                    for (let i = 1; i <= 10; i++) {
                        this.list.unshift(firstValue - i);
                    }
                    this.$refs.loadmore.onTopLoaded();
                }, 1500);
                // this.currentPage = 1;
                // setTimeout(()=>{
                //     this.renderTasklist(done);
                //     this.$refs.loadmore.onTopLoaded();
                // }, 1000)
            },
        }
  };
</script>
