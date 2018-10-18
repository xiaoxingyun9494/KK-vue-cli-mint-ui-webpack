/**
 * plus和vue结合的方法
 */
import os from './os';
import back from './back';
import event from './event';
import storage from './storage';

export default function install(Vue) {
    /**添加方法到vue原型上 */
    Vue.prototype.$os = os;
    Vue.prototype.$back = back;
    Vue.prototype.$event = event;
    Vue.prototype.$storage = storage;

    /**混合created的钩子函数, 在create添加plus的执行逻辑*/
    Vue.mixin({
        created() {
            if (this.$os.plus) {
                let _options = this.$options;
                this.$event.plusReady(() => {
                    if (typeof _options.plusReady === 'function') {
                        _options.plusReady.call(this);
                    };
                    if (typeof _options.onNetchange === 'function') {
                        this.$event.onNetchange(() => _options.onNetchange.call(this));
                    };
                })
            }
        }
    });
}