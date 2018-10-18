import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/home'
import Task_list from '../views/task_center/task_list'
import Task_detail from '../views/task_center/task_detail'
import Income from '../views/home/income'
import Income_chart from '../views/home/income_chart'
import Change from '../views/mine/change'
import Exchange_record from '../views/home/exchange_record'
import Master from '../views/mine/master'
import Apprentice from '../views/home/apprentice'
import How from '../views/mine/how_to_apprentice'
import Msg from '../views/mine/msg'
import Msg_detail from '../views/mine/msg_detail'
import Feedback from '../views/mine/feedback'
import About from '../views/mine/about'
import Task_procedure from '../views/task_center/task_procedure'
import Task_record from '../views/task_center/task_record'
import Ceshi from '../views/home/ceshi'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  // base: '__dirname',
  routes:[
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'home',
      path:'/home',
      component: Home,
      meta: {
              keepAlive: true, //此组件需要被缓存
              isBack:false, //用于判断上一个页面是哪个
          },
      children: [

      ]
    },
    {
      name: 'task_list',
      path:'/task_list',
      component: Task_list
    },
    {
      name: 'task_detail',
      path:'/task_detail',
      component: Task_detail,
    },
    {
      name: 'income',
      path:'/income',
      component: Income,
    },
    {
      path: '/income_chart',
      name: 'income_chart',
      component: Income_chart
    },
    {
      name: 'change',
      path:'/change',
      component: Change
    },
    {
      name: 'exchange_record',
      path:'/exchange_record',
      component: Exchange_record
    },
    {
      name: 'apprentice',
      path:'/apprentice',
      component: Apprentice
    },
    {
      name: 'how_to_apprentice',
      path:'/how_to_apprentice',
      component: How
    },
    {
      name: 'master',
      path:'/master',
      component: Master
    },
    {
      name: 'msg',
      path:'/msg',
      component: Msg
    },
    {
      name: 'msg_detail',
      path:'/msg_detail',
      component: Msg_detail
    },
    {
      name: 'feedback',
      path:'/feedback',
      component: Feedback
    },
    {
      name: 'about',
      path:'/about',
      component: About
    },
    {
      name: 'task_procedure',
      path:'/task_procedure',
      component: Task_procedure
    },
    {
      name: 'task_record',
      path:'/task_record',
      component: Task_record
    },
    {
      name: 'ceshi',
      path:'/ceshi',
      component: Ceshi
    }
    // {
    //   path: '/first',
    //   name: 'list',
    //   component: require('../views/list.vue'),
    //  children: [
    //     {
    //       path: '/PlanConfirm',
    //       name: 'home',
    //       component: require('../views/PlanConfirm.vue'),
    //     }
    //     ]
    // }
  ]
});


export default router;
