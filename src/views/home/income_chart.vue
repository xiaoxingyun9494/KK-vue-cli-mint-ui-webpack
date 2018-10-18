<template>
    <div>
        <mt-header fixed title="收益周报">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
        </mt-header>
        <div class="date-choies">
            <el-date-picker
                    v-model="filters.column.create_start_date"
                    type="date"
                    @change="getSTime"
                    :picker-options="pickerBeginDateBefore"
                    format="yyyy-MM-dd"
                    :default-value="startTime"
                    placeholder="开始时间">
            </el-date-picker>
            <el-date-picker
                    v-model="filters.column.create_end_date"
                    type="date"
                    @change="getETime"
                    format="yyyy-MM-dd"
                    :default-value="endTime"
                    :picker-options="pickerBeginDateAfter"
                    placeholder="结束时间">
            </el-date-picker>
            <button :disabled="changeBtn" @click="handleSearch()" class="income-search-btn" :class="{'gray-btn': changeBtn }">查询</button>
        </div>
        <div class="chart-list">
            <ve-histogram :data="chartData"></ve-histogram>
            <ve-pie :data="chartData2"></ve-pie>
        </div>
        <kkError v-show="isError" :type="errorType"></kkError>
    </div>
</template>
<script>
    import VeHistogram from 'v-charts/lib/histogram.common';
    import VePie from 'v-charts/lib/pie.common';
    import VeLine from 'v-charts/lib/line.common';
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import {TimePicker} from 'element-ui'
    import  '../../script/date.js'
    import kkError from '../../components/error'
    export default {
        name: "income_chart",

        data(){
            return {
                userId:'',
                chartData: {
                    columns: ['date', 'amount'],
                    rows: []
                },

                chartData2: {
                    columns: ['type', 'amount'],
                    rows: []
                },

                filters: {
                    column: {
                        create_start_date: '',
                        create_end_date: ''
                    },
                },

                // 开始时间限制选择，显示可选日期
                pickerBeginDateBefore:{
                    disabledDate: (time) => {
                        // let endDateVal = this.filters.column.create_end_date;
                        // if (endDateVal) {
                        //     return time.getTime() > endDateVal;
                        // }
                    }
                },

                // 结束时间限制选择，显示可选日期
                pickerBeginDateAfter:{
                    disabledDate: (time) => {
                        let beginDateVal = new Date(this.filters.column.create_start_date).getTime();
                        if (beginDateVal) {
                           return (beginDateVal + 6*24*60*60*1000) < time.getTime() || time.getTime() < beginDateVal;
                        }

                    }
                },

                startTime:new Date(new Date().getTime() - 6 * 24 * 3600 * 1000).Format("yyyy-MM-dd"),
                endTime:new Date().Format("yyyy-MM-dd"),
                changeBtn: false,
                errorType:''

            }
        },

        computed: {
            isError() {
                return this.errorType.length > 0 ? true : false;
            }
        },

        watch: {
            startTime: function() {
                console.log(this.startTime)

            },

            endTime: function() {
                console.log('结束改变')
            }
        },

        components: {
            VeHistogram,
            VePie,
            VeLine,
            ElDataPicker:TimePicker,
            kkError
        },

        created() {
            this.initData();
        },

        methods: {
            handleBack() {
                window.history.go(-1);
            },

            initData() {
                this.kkzStates = this.$storage().get('kkzStates') || {};
                this.userId = this.kkzStates.userId;
                this.randerChartdata();
            },

            // 渲染图表数据
            randerChartdata() {
                this.getChartdata().then(res => {
                    if (typeof res === 'undefined') return;
                    if (res.status == 'success') {
                        console.log(res)
                        this.chartData.rows = res.data.zj;
                        this.chartData2.rows = res.data.bj;
                        console.log( this.chartData2.rows)
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

            // 选择开始日期完毕触发
            getSTime(val) {
                this.sTime=new Date(val).Format("yyyy-MM-dd");//这个sTime是在data中声明的，也就是v-model绑定的值
                this.startTime = this.sTime;
                this.compareDate(this.startTime,this.endTime);
            },

            // 选择结束日期完毕触发
            getETime(val) {
                this.eTime=new Date(val).Format("yyyy-MM-dd");//这个eTime是在data中声明的，也就是v-model绑定的值
                this.endTime = this.eTime;
                this.compareDate(this.startTime,this.endTime);
            },

            // 获取图表数据
            getChartdata() {
                return this.$http.before(() => {
                    Indicator.open({
                        spinnerType: 'triple-bounce'
                    });
                }).get(`api/user/weekRecord/${this.userId}`, {
                    params: {
                        startTime:this.startTime,
                        endTime:this.endTime
                    }
                }).catch(err => {
                    Indicator.close();
                    this.errorType = err == 0 ? 'link' : 'server';
                })
            },

            // 点击查询按钮发送请求，渲染页面
            handleSearch() {
                this.randerChartdata()
            },

            /**
                开始时间结束时间比较，开始时间小于结束时间往前一周或者开始时间大于结束时间按钮禁止发送请求
                按钮变灰色
            **/
            compareDate(checkStartDate, checkEndDate) {
                var arys1= new Array();
                var arys2= new Array();
                if(checkStartDate != null && checkEndDate != null) {
                    arys1=checkStartDate.split('-');
                    var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
                    arys2=checkEndDate.split('-');
                    var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);
                    console.log(sdate.getTime())
                    console.log(edate.getTime())
                    if(sdate.getTime() < (edate.getTime() - 7*24*60*60*1000) || sdate.getTime() > edate.getTime()) {
                        this.changeBtn = true;
                    }else {
                        this.changeBtn = false;
                    }
                }
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/scss/variable';
    @import 'element-ui/lib/theme-chalk/index.css';
    .ve-pie {
        margin-top: .5rem;
    }
    .el-date-editor.el-input {
        width: 42%;
        float: left;
    }
    .date-choies {
        width: 100%;
        height: .9rem;
        line-height: .9rem;
        background-color: #fff;
        position: fixed;
        top: .9rem;
        z-index: 99;
        .income-search-btn {
            width: 16%;
            height: 86%;
            background-color: $buttonBgColor;
            color: #fff;
            border-radius: .2rem;
            border: 1px solid #fff;
        }
        .gray-btn {
            background-color: #ccc;
        }
    }
    .chart-list {
        width: 100%;
        margin-top: 2rem;
    }
</style>
