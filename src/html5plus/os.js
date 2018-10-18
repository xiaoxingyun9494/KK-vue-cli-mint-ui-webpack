/**
 * 系统环境的检测
 */
let ua = window.navigator.userAgent;
let ios = '';
let ipad = /(iPad).*OS\s([\d_]+)/.test(ua);
let plus = /Html5Plus/i.test(ua);
let iphone = /(iPhone\sOS)\s([\d_]+)/.test(ua);
let wechat = /(MicroMessenger)\/([\d.]+)/i.test(ua);
let stream = /StreamApp/i.test(ua);
let android = /(Android);?[\s/]+([\d.]+)?/.test(ua);
let version = ''; 
let isBadAndroid = ''; 

if (android) {
    version = ua.match(/(Android);?[\s/]+([\d.]+)?/)[2];
    isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
};

if (iphone) {
    ios = iphone;
    version = ua.match(/(iPhone\sOS)\s([\d_]+)/)[2].replace(/_/g, '.');
};

if (ipad) {
    ios = ipad;
    version = ua.match(/(iPad).*OS\s([\d_]+)/)[2].replace(/_/g, '.');
};

/**对外接口 */
export default {
    ios,
    plus,
    ipad,
    iphone,
    stream,
    wechat,
    android,
    version,
    isBadAndroid
};
