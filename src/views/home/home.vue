<template>
    <div class="content">
        <mt-tab-container v-model="tabSelected">
            <mt-tab-container-item id="首页">
                <mt-loadmore
                        :top-method="loadTop"
                        @top-status-change="handleTopChange"
                        ref="loadmore"
                >
                    <div class="kk-header-banner">
                        <cropper :headerImage="headerImage"  @getHeaderImage="newHeaderImage"></cropper>
                        <div class="kk-header-bottom">
                            <div class="header-bottom-left">
                                <h3 class="bottom-left-title">累计收益</h3>
                                <span class="bottom-left-amount" v-text="userInfo ? userInfo.totalMoney : null">88.88</span><span>元</span>
                            </div>
                            <div class="header-bottom-right">
                                <h3 class="bottom-right-title">账户余额</h3>
                                <span class="bottom-right-amount" v-text="userInfo ? userInfo.personalMoney : null">8.88</span><span>元</span>
                            </div>
                        </div>
                    </div>
                    <div class="kk-content">
                        <router-link class="kk-content-task" to="/task_list">
                            <p class="task-title"><span>今日任务</span><span class="task-tip"><i class="task-number">15</i>个任务</span></p>
                            <img class="task-img" src="../../assets/task.png">
                        </router-link>
                        <router-link class="kk-content-apprentices" :to="{path:'/apprentice', query:{subCount:userInfo ? userInfo.subCount : null,subMoney:userInfo ? userInfo.subMoney : null}}">
                            <p class="apprentices-title"><span>收徒弟</span><span class="apprentices-tip">提成无限</span></p>
                            <img class="apprentices-img" src="../../assets/apprentice.png">
                        </router-link>
                        <router-link class="kk-content-procedure" to="/task_procedure">
                            <p class="procedure-title"><span>任务流程</span><span class="procedure-tip">简单易懂</span></p>
                            <img class="procedure-img" src="../../assets/procedure.png">
                        </router-link>
                        <router-link class="kk-content-income" to="/income">
                            <p class="income-title"><span>收益明细</span><span class="income-tip">高额收益</span></p>
                            <img class="income-img" src="../../assets/income.png">
                        </router-link>
                    </div>

                    <div slot="top" class="mint-loadmore-top">
                        <span v-text="topContent" v-show="!showTopLoad"></span>
                        <span v-show="showTopLoad">
                            <mt-spinner type="snake"></mt-spinner>
                        </span>
                    </div>
                </mt-loadmore>
            </mt-tab-container-item>
            <mt-tab-container-item id="兑换">
                <mt-header title="兑换">
                    <mt-button slot="right">
                        <router-link to="/exchange_record">
                            <span class="kk-icon-changeRecord"></span>
                        </router-link>
                    </mt-button>
                </mt-header>
                <div class="kk-change-center">
                    <mt-navbar v-model="selected">
                        <mt-tab-item @click.native="handelChangetype(item)"  v-for="(item,i) in changeType" :key="i" :id='item.id' v-text='item.type'>支付宝</mt-tab-item>
                    </mt-navbar>
                    <div class="change-content">
                        <div class="change-content-amount">
                            <div class="change-amount-single" v-for="(item,i) in changeList" :class="{'selected-change-single':isSelected==i}" @click="handelChange($event,i,item)">
                                <p class="change-cash"><span v-text="item.changeAmount">10</span>元支付宝</p>
                                <p class="change-kk">兑换价：<span v-text="item.kkAmount">12</span><span>元</span></p>
                            </div>
                           <!--  <div class="change-amount-single">
                                <p class="change-cash"><span>10</span>元支付宝</p>
                                <p class="change-kk">兑换价：<span>12</span><span>元</span></p>
                            </div>
                            <div class="change-amount-single">
                                <p class="change-cash"><span>10</span>元支付宝</p>
                                <p class="change-kk">兑换价：<span>12</span><span>元</span></p>
                            </div> -->
                        </div>
                        <div class="change-buttom" v-show="selected==1">
                            <input class="account-number" type="tel" name="" placeholder="请输入需要充值的支付宝账号" v-model="acountText">
                            <input class="account-name" type="text" name="" placeholder="输入支付宝真实身份信息(真实姓名)" v-model="realName">
                            <button class="exchange" @click="handelExchange">确认兑换</button>
                        </div>
                    </div>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="我的">
                <div class="kk-personal-header">
                    <!-- <img class="personal-avater" src="../../assets/timg.jpg" alt=""> -->
                    <!-- <div class="personal-avater"> -->
                      <cropper :headerImage="headerImage"  @getHeaderImage="newHeaderImage"></cropper>　
                    <!-- </div> -->
                    <p class="personal-name" v-text="userInfo ? userInfo.userName : null">曦小晨</p>
                    <p class="personal-phone" v-text="telNumber"></p>
                    <p class="personal-share">收徒码:<span v-text="userInfo ? userInfo.subCode : null">00880066</span><span class="kk-icon-share"></span></p>
                </div>
                <mt-cell title="兑换" to="/change" is-link>
                    <span slot="icon" class="kk-icon-change"></span>
                </mt-cell>
                <mt-cell title="我的师傅" to="/master" is-link v-show="!haveMaster">
                    <span style="color: red">拜师奖励2元</span>
                    <span slot="icon" class="kk-icon-master"></span>
                </mt-cell>
                <mt-cell title="我的师傅" v-show="haveMaster">
                    <span style="color: red;margin-right:.5rem;" v-text="userInfo ? userInfo.parentCode : null">000022</span>
                    <span slot="icon" class="kk-icon-master"></span>
                </mt-cell>
                <mt-cell title="我的徒弟" to="/apprentice" is-link >
                    <span style="color: red">收徒越多奖励越丰厚</span>
                    <span slot="icon" class="kk-icon-apprentice"></span>
                </mt-cell>
                <mt-cell title="常见问题" to="/msg" is-link>
                    <span slot="icon" class="kk-icon-msg"></span>
                </mt-cell>
                <mt-cell title="问题反馈" to="/feedback" is-link>
                    <span slot="icon" class="kk-icon-feedback"></span>
                </mt-cell>
                <mt-cell title="关于我们" to="/about" is-link>
                    <span slot="icon" class="kk-icon-about"></span>
                </mt-cell>
            </mt-tab-container-item>
        </mt-tab-container>
        <mt-tabbar v-model="tabSelected" fixed="fixed">
            <mt-tab-item id="首页">
                <span slot="icon" class="kk-icon-home"></span>
            首页
            </mt-tab-item>
            <mt-tab-item id="兑换">
                <span slot="icon" class="kk-icon-change"></span>
            兑换
            </mt-tab-item>
            <mt-tab-item id="我的">
                <span slot="icon" class="kk-icon-mine"></span>
            我的
            </mt-tab-item>
        </mt-tabbar>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    // import storage from '../../html5plus/storage';
    import cropper from "../../components/cropper";
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import kkError from '../../components/error';
    export default {
        name: "home",

        data(){
            return {
                errorType:'',
                tabSelected:'首页',
                fixed:true,
                // haveMaster:false,
                userId:'',
                userInfo:{},
                headerImage:"http://192.168.2.106/storage/timg.jpg",
                telNumber:'',
                changeType:[{id:1,type:'支付宝'},{id:2,type:'竞猜币'}],
                selected: 1,
                isSelected:0,
                changeList:[],
                changeId:'',
                acountText:'',
                realName:'',
                localAcount:'',
                kkzStates:{},
                topContent:'',//下拉刷新
                showTopLoad:''
            }
        },

        components: {
            cropper,
            kkError
        },

        computed: {
            isError() {
                return this.errorType.length > 0 ? true : false;
            },

            haveMaster() {
                return this.userInfo.parentCode != 0 ? true : false;
            }
        },

        created() {
            this.initData();

        },

        methods: {

            // 首页下拉刷新状态改变
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

            // 首页下拉刷新事件
            loadTop(done) {
                setTimeout(()=>{
                    this.initData();
                    this.$refs.loadmore.onTopLoaded();
                }, 1000)
            },


            // 点击选择兑换方式
            handelChangetype(data) {
                this.isSelected = 0;
                this.renderChangelist();
            },

            // 点击选择兑换金额
            handelChange(e,index,data) {
                this.isSelected = index;
                this.changeId =  data.id;
                console.log(data.id)
                console.log(data.kkAmount)
            },

            // 点击确认兑换
            handelExchange() {
                if (this.acountText.length != 0 && this.realName.length != 0) {
                    this.exchangeResult();
                }else {
                    Toast({
                        message: '账号姓名不能为空！',
                        duration:2000,
                        iconClass: 'kk-icon-fail'
                    });
                }

            },

            // 电话号码处理
            handelTelNumber(phone) {
                var myphone = phone.substr(3, 4);
                return phone.replace(myphone, "****");
            },
            // 改变头像
            newHeaderImage(newImg){
                this.headerImage = newImg;
            },

            // 初始化数据
            initData() {
                this.states = {};
                this.states.account = '15966666666';//模拟本地存储数据
                this.$storage().setAll('states',this.states);
                // this.kkzStates = this.$storage().get('kkzStates') || {};
                // this.userId = this.kkzStates.userId;
                this.appStates = this.$storage().get('states') || {};
                this.localAcount = this.appStates.account;
                this.receiveAutologinid();
                this.renderChangelist();
                this.refreshToken();
            },

            // 刷新token
            refreshToken() {
                this.$http.before(() => {
                  // this.showSnake = true;
                }).post('oauth/token',{
                    grant_type:'password',
                    client_id:12,
                    client_secret:'qhChkbBFzeS1GhRsuWBqrjnlYgpRFQGDnmNi8i5u',
                    username:'test@test.com',
                    password:'test',
                    scope:''
                }).then(res => {
                    console.log(res)
                    this.kkzStates.accessToken = res.token_type + ' '+res.access_token;
                    this.kkzStates.refreshToken =  res.refresh_token
                    this.$storage().setAll('kkzStates',this.kkzStates);
                }).catch(err => {
                   this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 获取自动登录返回的用户id
            receiveAutologinid() {
                this.getAutologinid().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        this.userId = res.data.userId;
                        this.renderUserinfo();
                        this.kkzStates.userId =  this.userId;
                        this.$storage().setAll('kkzStates',this.kkzStates);
                    }
                })
            },

            // 获取全v好视界本地存储用户账号,传到服务器自动登录
            getAutologinid() {
                return this.$http.before(() => {

                }).post('api/user/regist',{
                    mobile:this.localAcount
                }).catch(err => {

                })
            },

            // 渲染用户信息
            renderUserinfo() {
                console.log(this.userId)
                this.getUserinfo().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.userInfo = res.data;
                        this.headerImage = this.userInfo ? this.userInfo.avatar : null;
                        this.telNumber = this.handelTelNumber(this.userInfo ? this.userInfo.mobile : null);
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

            // 获取用户信息
            getUserinfo() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/user/info/${this.userId}`)
                .catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 渲染兑换列表
            renderChangelist() {
                this.getChangelist().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        this.changeList =  res.data;
                        this.changeId = this.changeList[0] ? this.changeList[0].id : null;
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

            // 获取兑换列表
            getChangelist() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/change/lists/${this.selected}`)
                .catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 兑换结果
            exchangeResult() {
                this.postExchange().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        Toast({
                            message: '申请发送成功！',
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
                        // this.errorType = 'data';
                    };
                    Indicator.close();
                })
            },

            // 兑换
            postExchange() {
                return this.$http.before(() => {
                    Indicator.open({
                        text:'正在申请',
                        spinnerType: 'triple-bounce'
                    });
                }).post('api/change/apply',{
                    userId:this.userId,
                    changeId:this.changeId,
                    account:this.acountText,
                    realName:this.realName
                }).catch(err => {
                    Indicator.close();
                    if (err == 0 ) {
                        Toast({
                            message: '网络异常！',
                            duration:2000,
                            iconClass: 'kk-icon-fail'
                        });
                    }else {
                        Toast({
                            message: '系统正在维护！',
                            duration:2000,
                            iconClass: 'kk-icon-fail'
                        });
                    }
                    // this.errorType = err == 0 ? 'link' : 'server';
                })
            },
        }
    };
</script>
<style lang="scss">
    @import '../../style/scss/variable';
    body {
        background-color:#fff;
    }
    .kk-header-banner {
        width:100%;
        height:4rem;
        background-image: url('../../assets/header_bg.jpg');
        background-size: 100% 100%;
        position:relative;
        .header-left {
            width: 30%;
            display: inline-block;
            transform: translateY(-50%);
            position: absolute;
            top: 50%;
            left: 50%;
            .kk-head {
                border-radius:50%;
            }
        }
        // .header-right {
        //     width:70%;
        //     color:#fff;
        //     display:inline-block;
        //     font-size:.32rem;
        //     transform: translateY(-50%);
        //     position: absolute;
        //     top: 50%;
        //     left: 3.3rem;
        //     .header-right-title {
        //         font-size:.38rem;
        //     }
        //     .header-right-total {
        //         font-size:.72rem;
        //     }
        //     .kk-icon-arrow {
        //         transform: translateY(-50%);
        //         position: absolute;
        //         top: 50%;
        //         left: 3.3rem;
        //     }
        //     .kk-icon-arrow:before {
        //         content: "\e600";
        //     }
        // }
        .kk-header-bottom {
            height: 1.5rem;
            margin-top: .4rem;
            position:relative;
            // &:before {
            //     content:'';
            //     width: 2px;
            //     height: 80%;
            //     background-color: #fff;
            //     position:absolute;
            //     top: 10%;
            //     left:50%;
            // }
            .header-bottom-left, .header-bottom-right {
                display: inline-block;
                width: 50%;
                height: 100%;
                line-height: .7rem;
                float: left;
                text-align: center;
                color:red;
                .bottom-left-title, .bottom-right-title {
                    font-size: .36rem;
                    color:#fff;
                }
                .bottom-left-amount, .bottom-right-amount {
                    font-size: .36rem;
                    color: red;
                }
            }
        }
    }
    .kk-content {
        width:100%;
        height:6rem;
        position:relative;
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            height: 6rem;
            width: 1px;
            background-color: #f1efef;
        }
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            height: 1px;
            width: 100%;
            background-color: #f1efef;
        }
        .kk-content-task, .kk-content-apprentices, .kk-content-procedure, .kk-content-income {
            width:50%;
            height:3rem;
            text-align: center;
            float:left;
            // background-color: yellowgreen;
            color: #000;
        }
        .task-title, .apprentices-title, .procedure-title, .income-title {
            display: inline-block;
            height: 100%;
            text-align: center;
            vertical-align: middle;
            padding: 1rem 0;
            font-size: .36rem;
        }
        .task-img, .apprentices-img, .procedure-img, .income-img {
            width: 1.5rem;
            height: 1.5rem;
            vertical-align: middle;
        }
        .kk-content-income {

        }
        .task-tip, .apprentices-tip, .procedure-tip, .income-tip {
            font-size:.28rem;
            color:$mainColor;
            display: block;
            .task-number {
                color:$mainColor;
            }
        }
        .apprentices-tip {
            font-size:.28rem;
            color:$mainColor;
        }
    }
    .kk-change-center {
        margin-top: -.9rem;
    }
    .change-content {
        width: 100%;
        margin-top: .3rem;
        .change-content-amount {
            height: 1.3rem;
            .change-amount-single {
                width: 31%;
                height: 1.3rem;
                padding: .2rem;
                text-align: center;
                font-size: .28rem;
                color: red;
                float: left;
                background-color: #c7c7c5;
                margin-left: 1.8%;
                margin-top: .2rem;
                // position:relative;
                // &:before {
                //     content:'';
                //     position:absolute;
                //     width: .2rem;
                //     height: .2rem;
                //     border-radius: 50%;
                //     background-color: #fff;
                //     top: -.1rem;
                //     left:.2rem;
                // }
                // &:after {
                //     content:'';
                //     position:absolute;
                //     width: .2rem;
                //     height: .2rem;
                //     border-radius: 50%;
                //     background-color: #fff;
                //     bottom: -.1rem;
                //     left:.2rem;
                // }
            }
            .selected-change-single {
                background-color: red;
                color: #fff;
            }
        }

        .change-buttom {
            width: 100%;
            margin-top: .2rem;
            text-align: center;
            .account-number, .account-name, .exchange {
                width: 6rem;
                height: .8rem;
                line-height: .8rem;
                font-size: .28rem;
                border: 1px solid #ccc;
                border-radius: .2rem;
                background-color: #f5f5f2;
                margin-top: .4rem;
                padding-left: .2rem;
            }
            .exchange {
                color: #fff;
                font-size: .32rem;
                border:none;
                padding-left: 0;
                background-color: $buttonBgColor;

            }
        }
    }
    .kk-personal-header {
        width:100%;
        height:4rem;
        color:#fff;
        text-align:center;
        background-image: url('../../assets/mine_header_bg.jpg');
        background-size: 100% 100%;
        .personal-avater {
            width: 23%;
            margin-top: .35rem;
            border-radius: 50%;
            margin: 0 auto;
            background-color: pink;
            width: 1.6rem;
            height: 1.6rem;
        }
        .personal-name {

        }
        .personal-phone {

        }
        .personal-share {
            color:#fff;
            font-size:.28rem;
            padding-bottom: .5rem;
        }
    }
    .kk-icon-procedure, .kk-icon-list, .kk-icon-record, .kk-icon-income {
        font-size: 1.2rem;
        line-height: 2rem;
    }
    .kk-icon-home, .kk-icon-task, .kk-icon-mine, .kk-icon-share, .kk-icon-change, .kk-icon-master, .kk-icon-apprentice, .kk-icon-feedback, .kk-icon-msg, .kk-icon-about {
        font-size: .46rem;
        line-height: 24px;
        margin-right: .25rem;
        margin-bottom:.1rem;
        vertical-align: middle;
    }
    .kk-icon-changeRecord {
        font-size: .42rem;
        color: #fff;
    }
    .kk-icon-changeRecord:before {
        content: "\e662";
    }
    .kk-icon-home:before {
        content: "\e602";
    }
    .kk-icon-task:before {
        content: "\e609";
    }
    .kk-icon-mine:before {
        content: "\e604";
    }
    .kk-icon-share:before {
        content: "\e657";
    }
    .kk-icon-change:before {
        content: "\e71a";
        // color:#666;
    }
    .kk-icon-master:before {
        content: "\e65b";
        color:#d81e06;
    }
    .kk-icon-apprentice:before {
        content: "\e65f";
        color:#1296db;
    }
    .kk-icon-feedback:before {
        content: "\e62e";
        color:#e98f36;
    }
    .kk-icon-msg:before {
        content: "\e60b";
        color:#1afa29;
    }
    .kk-icon-about:before {
        content: "\e68f";
        color:#1296db;
    }
    .kk-icon-procedure:before {
        content: "\e60c";
        color:#4caf50;
    }
    .kk-icon-list:before {
        content: "\e631";
        color:#1296db;
    }
    .kk-icon-record:before {
        content: "\e620";
        color:#ef4f4f;
    }
    .kk-icon-income:before {
        content: "\e632";
        color:#efb710;
    }
</style>
