//兼容低版本的垫片
import promise from 'es6-promise';
promise.polyfill();

//ajax的主要文件, 不考虑低版本的话，以上的可以不引入
// import md5 from 'md5';
import conf from '../config';
import axios from 'axios';
import { serialize } from './utils';
import storage from '../html5plus/storage';

//将序列化函数扩展到axios, 变成axios的静态方法, 有些地方可能会用到这个函数
axios.serialize = serialize;

//app类型
var appType = conf.appType;
// let appType = 'QUANVKAN';

//基础URL
axios.defaults.baseURL = conf.baseURL;

//跨域
// axios.defaults.withCredentials = true;

//设置默认头信息
var kkzStates = storage().get('kkzStates') || {};
axios.defaults.headers = {
    "Accept": "application/json",
    // "Content-Type": "application/json"
    "Authorization": kkzStates.accessToken,

};

//设置超时
axios.defaults.timeout = 10000;

//发送请求前的函数
axios.before = function (callback) {
    try {
        callback && callback();
    } catch(err) {} finally {
        return this;
    };
};

/**请求的拦截 */
axios.interceptors.request.use(config => {
    /**自己服务器的请求拦截 */
    if (config.baseURL === conf.baseURL && config.method === 'post') {
        var kkzStates = storage().get('kkzStates') || {};
        //app类型的切换
        if (config.data.app_type) {
            config.data.app_type = appType;
        };

        // return Object.assign(config, {
        //     data: JSON.stringify({
        //         api_key: null,
        //         access_token: states.token,
        //         // data_sign: md5(JSON.stringify(config.data)),
        //         json_data_encode: encodeURIComponent(JSON.stringify(config.data)),
        //         service_code: null
        //     })
        // });

        return Object.assign(config, {
                Authorization: kkzStates.accessToken,
        });

    };
    /**第三方服务器并且是JSON类型的post方式请求拦截 */
    if (config.method === 'post' && config.headers['Content-Type'].indexOf('application/json') > -1) {
        return Object.assign(config, {
            data: JSON.stringify(config.data)
        });
    };
    /**以表单形式的post方式请求拦截 */
    if (config.method === 'post' && config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1) {
        return Object.assign(config, {
            data: serialize(config.data)
        });
    };
    /**get的请求 */
    return config;

}, err => {
    return Promise.reject(err)
});


/**响应的拦截 */
axios.interceptors.response.use(res => {
    if (res.status !== 200) {
        return Promise.reject(res.status);
    };
    return res.data;
}, err => {
    if (typeof err === 'object') {
        if (typeof err.request === 'object') {
            err = err.request.status;
        } else {
            err = err.request;
        };
    };
    return Promise.reject(err);
});

export default axios;
