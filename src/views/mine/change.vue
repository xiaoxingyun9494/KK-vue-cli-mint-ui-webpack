<template>
    <div>
        <mt-header fixed title="兑换">
            <mt-button @click="handleBack" icon="back" slot="left">返回</mt-button>
            <mt-button slot="right">
                <span class="kk-icon-changeRecord"></span>
            </mt-button>
        </mt-header>
        <mt-navbar v-model="selected">
            <mt-tab-item id="zhifubao">支付宝</mt-tab-item>
            <mt-tab-item id="jiangcaibi">竞猜币</mt-tab-item>
        </mt-navbar>

        <!-- tab-container -->
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="zhifubao">
                <mt-cell v-for="n in 10" :key="n" :title="'支付宝 ' + n" />
            </mt-tab-container-item>
            <mt-tab-container-item id="jiangcaibi">
                <mt-cell v-for="n in 8" :key="n" :title="'竞猜币 ' + n" />
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>
<script>
    export default {
        name: "change",
        data(){
            return {
              selected: 'zhifubao'
            }
        },

        methods: {
            handleBack() {
                window.history.go(-1);
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/scss/variable';
    .kk-icon-changeRecord {
        font-size: .42rem;
        color: #fff;
    }
    .kk-icon-changeRecord:before {
        content: "\e662";
    }
</style>
