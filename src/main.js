import Vue from "vue";
import App from './App.vue'
import VueRouter from "vue-router"
import PlusVue from './html5plus/plus_vue'
import TimePicker from 'element-ui'
import router from './router'
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css'
import refreshRem from './script/rem';
// import FastClick from 'fastclick';
import axios from './script/ajax'
// import axios from 'axios'



import './style/scss/reset.scss';
import './style/scss/icon.scss';
import './style/scss/my-mint.scss';

Vue.config.productionTip = false
refreshRem(750);
// FastClick.attach(document.body);
Vue.prototype.$http = axios;
Vue.use(MintUI);
Vue.use(VueRouter);
Vue.use(PlusVue);
Vue.use(TimePicker);


//创建Vue实例对象
new Vue({
    el: '#app',
    router,
    // store, //别忘了这个属性，
    render: c => c(App)
});
