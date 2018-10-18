<template>
    <div>
        <mt-header fixed title="任务">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="task-header-bar">
            <img class="task-header-img" :src="thumb">
            <div class="task-header-left">
                <h2 class="task-header-title" v-text="taskTitle">阿里巴巴</h2>
              <span class="task-header-income" v-text="taskAmount">+0.56</span><span class="task-size">45.45M</span>
            </div>
            <div class="task-header-right">
                <div id="div1" @click="createDownload(downloadUrl)">
                    <div id="div2">
                        <div class="downloadText">下载</div>
                    </div>
                </div>
            </div>
        </div>
        <ul class="task-procedure-content">
            <li class="task-procedure-list" v-for="(item,i) in taskNodelist" :class="{'procedure-complete':item.status==2}" :key="i">
                <p class="task-procedure-text" v-text="item.nodeTitle"></p>
                <p class="add-income" v-text="'+'+item.nodeAmount"></p>
            </li>
        </ul>
        <div class="task-procedure-intro" >
           <!--  <p class="task-procedure-attention">注意：<span>注册登录并浏览内容3分钟即可获得奖励，连续登录会有更多奖励哦！</span></p>
            <p class="task-intro-text">【阿里巴巴1688】注册登录并浏览内容3分钟即可获得奖励，连续登录会有更多奖励哦！注册登录并浏览内容3分钟即可获得奖励，连续登录会有更多奖励哦！</p>
            <img class="task-procedure-img" src="../../assets/tao2.jpg">
            <img class="task-procedure-img" src="../../assets/tao1.jpg"> -->
            <div class="register-feedback">
                <mt-field label="用户名" placeholder="请输入用户名"></mt-field>
                <mt-field label="手机号" placeholder="请输入手机号" type="tel"></mt-field>
                <mt-actionsheet
                                :actions="actions"
                                v-model="sheetVisible">
                </mt-actionsheet>
                <up-loader :src="defaultSrc"></up-loader>
                <button class="commit-task">提交任务</button>
            </div>
        </div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import kkError from '../../components/error';
    import upLoader from '../../components/uploader'
    export default {
        name: "task_detail",
        data(){
            return {
                missionId:this.$route.query.missionId,
                taskTitle:this.$route.query.mission_title,
                taskAmount:'+' + this.$route.query.amount,
                thumb:this.$route.query.thumb,
                taskNodelist:[],
                downloadUrl:'',
                downloadMissionid:'',
                introContent:'',
                errorType:'',
                count:0,
                isClick:false,
                apkName:'',
                userId:'',
                actions:[{
                            name: '拍照',
                            method : this.getCamera // 调用methods中的函数
                          }, {
                            name: '从相册中选择',
                            method : this.getLibrary    // 调用methods中的函数
                        }],
                sheetVisible:true,
                defaultSrc:'../../assets/timg.jpg'
                // dtask:null
            }
        },

        components: {
            kkError,
            upLoader
        },

        computed: {
            isError() {
                return this.errorType.length > 0 ? true : false;
            }
        },

        watch: {

        },

        plusReady() {
            this.initData();
        },

        // created() {
        //     this.renderTaskdetail()
        // },

        methods: {
            initData() {
                this.kkzStates = this.$storage().get('kkzStates') || {};
                this.userId = this.kkzStates.userId;
                this.renderTaskdetail();
                if(this.isInstalledApp('com.quanvkan.client')) {
                    Toast({
                        message: '已安装！',
                        duration:2000,
                        iconClass: 'kk-icon-success'
                    });
                    // this.isClick = true;
                }else {
                    Toast({
                        message: '未安装！',
                        duration:2000,
                        iconClass: 'kk-icon-success'
                    });
                }

            },

            // 下载完成后弹出安装提示，安装完成的成功以及失败回调
            startInstall(url) {
                plus.runtime.install(url, {}, () => {
                        // plus.runtime.restart();
                    if(this.isInstalledApp('com.quanvkan.client')) {
                        Toast({
                            message: '已安装！',
                            duration:2000,
                            iconClass: 'kk-icon-success'
                        });
                        this.downloadComplete('<div id="div2"><div class="downloadText">已安装</div></div>');
                        this.installCallback();
                    }else {
                        Toast({
                            message: '未安装！',
                            duration:2000,
                            iconClass: 'kk-icon-success'
                        });
                    }

                }, (e) => {
                    plus.nativeUI.toast('应用安装失败!');
                });
            },

            // 创建下载任务，并将监听下载过程
            createDownload(url) {
                var dtask = plus.downloader.createDownload( url, {
                    method: 'POST',
                    timeout: 6,
                    filename: '_doc/update/',
                    retryInterval: 3
                });
                if(!this.isClick) {
                    this.isClick = true;
                    dtask.start();
                }else {
                    return
                }

                // 监听下载进度，显示到进度条
                dtask.addEventListener('statechanged', (download, status) => {
                    if (download.state === 3) {
                        this.downloadApp(parseInt((download.downloadedSize / download.totalSize) * 100))
                    } else if (download.state === 4) {
                        if (status == 200) {
                            setTimeout(() => {
                                this.apkName = download.filename;
                                this.startInstall(download.filename);
                            }, 500);
                        } else {
                            setTimeout(() => {

                            }, 2000);
                        };
                    };
                }, false);
            },

            // 下载进度
            getDownloadprocedure(count) {
                if (count >= 100) {
                    this.downloadComplete('<div id="div2"><div class="downloadText">正在安装</div></div>')
                } else {
                    var div = document.getElementById("div2")
                    div.innerText = count + "%"
                    div.style.width = (count/55.55) + "rem"
                }
            },

            // 下载进度样式更改
            downloadApp(count) {
                var div = document.getElementById("div1");
                div.style.cssText += 'background-color:rgba(0,0,0,.3);'
                this.getDownloadprocedure(count);
            },

            // 下载完成 动作
            downloadComplete(htmlText) {
                var div = document.getElementById("div1");
                div.style.cssText += 'background-color:yellowgreen;';
                div.innerHTML = htmlText;
            },

            // 读取手机安装应用列表 ，判断手机中是否安装了某个app
            isInstalledApp(pkgname) {
                plus.android.importClass('java.util.ArrayList');
                plus.android.importClass('android.content.pm.PackageInfo');
                plus.android.importClass('android.content.pm.PackageManager');
                var MainActivity = plus.android.runtimeMainActivity();
                var PackageManager = MainActivity.getPackageManager();
                var pinfo = plus.android.invoke(PackageManager, 'getInstalledPackages', 0)
                if (pinfo != null) {
                    for (var i = 0; i < pinfo.size(); i++) {
                        if (pinfo.get(i).toString().indexOf(pkgname) !== -1) {
                            return true;
                        }
                    }
                }
                return false;
            },

            // 检测已安装回调
            installCallback() {
                alert(this.downloadMissionid)
                this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).post('api/mission/complete',{
                    userId:this.userId,
                    missionNodeId:this.downloadMissionid
                }).then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        Toast({
                            message: res.message,
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
                }).catch(err => {
                    Indicator.close();
                    Toast({
                        message: '失败回调！',
                        duration:2000,
                        iconClass: 'kk-icon-fail'
                    });
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            //渲染任务详情
            renderTaskdetail() {
                this.getTaskdetail().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.taskNodelist = res.data.missionNode;
                        this.introContent = res.data.content;
                        for(var i = 0; i <= this.taskNodelist.length-1; i++) {
                            if(this.taskNodelist[i].type == 1) {
                                this.downloadUrl = this.taskNodelist[i].downUrl;
                                this.downloadMissionid = this.taskNodelist[i].id;
                            }
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

            // 获取任务详情
            getTaskdetail() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get('/api/mission/nodes', {
                    params: {
                        userId:this.userId,
                        missionId:this.missionId
                    }
                }).catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            getCamera() {
                Toast('这是一个 Message Box');
            },

            getLibrary() {
                Toast('这是一个 Message Box');
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
    body {
        background-color: #eee;
    }
    .task-header-bar {
        max-width: 7.5rem;
        margin-top: .9rem;
        width: 100%;
        padding: .1rem;
        position: fixed;
        top: 0;
        background-color: #fff;
        z-index: 99;
        .task-header-img {
            width: .8rem;
            height: .8rem;
            vertical-align: middle;
            border-radius: .1rem;
        }
        .task-header-left {
            display: inline-block;
            vertical-align: middle;
            margin-left: .1rem;
            .task-header-title {
                font-size: .28rem;
            }
            .task-header-income {
                font-size: .26rem;
                color: red;
            }
            .task-size {
                font-size: .24rem;
                color: #ccc;
                margin-left: .1rem;
            }
        }
        .task-header-right {
            display: inline-block;
            vertical-align: middle;
            float: right;
            margin-top: .15rem;
            margin-right: .3rem;
            // margin-left: 2.5rem;
            // .download-btn {
            //     display: inline-block;
            //     width: 1.4rem;
            //     height: 0.6rem;
            //     line-height: .6rem;
            //     text-align: center;
            //     border-radius: .1rem;
            //     color: #fff;
            //     font-size: .28rem;
            //     background-color: red;
            // }
            #div1 {
                width: 1.8rem;
                height: .6rem;
                line-height: .65rem;
                color: #fff;
                font-size: .28rem;
                border-radius: .2rem;
                margin: 0 auto;
                background-color: red;
                text-align: center;
                position: relative;
            }
            #div2 {
                width: 0px;
                height: .6rem;
                line-height: .65rem;
                border-radius: .2rem;
                background-color: yellowgreen;
                text-align: center;
            }
            .downloadText {
                width: 1.8rem;
                height: .6rem;
                line-height: .65rem;
                position: absolute;
                transform: translateX(-50%);
                left: 50%;
            }
        }

    }
   .task-procedure-content {
        width: 90%;
        margin: 0 auto;
        background-color: #e2e0e0;
        padding: .5rem;
        margin-top: 2rem;
        .task-procedure-list {
            margin-bottom: .1rem;
            font-size: .28rem;
            border-left: 1px solid #ccc;
            position: relative;
            padding: .2rem;
            &:before {
                content:'';
                position: absolute;
                width: .1rem;
                height: .1rem;
                top: -.1rem;
                left: -.05rem;
                background-color: #ccc;
                border-radius: 50%;
            }
            .procedure-sort {
                vertical-align: middle;
                display: inline-block;
            }
            .task-procedure-text {
                width: 71%;
                display: inline-block;
                vertical-align: middle;
                margin-left: .2rem;
            }
            .add-income {
                font-size: .24rem;
                margin-left: .6rem;
                vertical-align: middle;
                display: inline-block;
            }
        }
        .procedure-complete {
            color: red;
        }
    }
    .task-procedure-intro {
        width: 100%;
        text-align: center;
        .task-procedure-attention {
            font-size: .28rem;
            color: #6d6b6b;
            padding: .5rem;
            text-align: left;
        }
        .task-intro-text {
            font-size: .28rem;
            padding: .5rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: left;
        }
        .task-procedure-img {
            width: 90%;
            margin-top: .2rem;
        }
        .register-feedback {
            width: 90%;
            margin: .5rem auto;
            .mint-cell-text {
                vertical-align: middle;
                font-size: .32rem;
            }
            .mint-field-core {
                text-align: justify;
                font-size: .28rem;
                padding-left: .2rem;
            }
            .mint-field {
                margin-top: 0;
            }
            .commit-task {
                background-color: $mainColor;
                width: 6rem;
                height: .8rem;
                line-height: .8rem;
                margin-top: .5rem;
                color: #fff;
                font-size: .32rem;
                border-radius: .2rem;
            }
        }
    }

</style>
