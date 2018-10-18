/**
 * 系统检测函数
 */
let sys = (function () {
    var ua = window.navigator.userAgent;
    var match = ua.toLowerCase().match(/android\s([0-9\.]*)/);
    return {
        isMobile: /mobile/i.test(ua),
        isPlus: /Html5Plus/i.test(ua),
        isIOS: /(iPhone\sOS)\s([\d_]+)/.test(ua),
        isAndroid: /(Android);?[\s/]+([\d.]+)?/.test(ua),
        isChrome: /chrome/i.test(ua),
        getAndroidVersion: match ? parseInt(match[1], 10) : false
    };
})();

/**
 * DOM元素的检查函数
 * @param {object} object 检查的对象
 */
function isDOMNode(object) {
    if (typeof HTMLElement === 'object') {
        return object instanceof HTMLElement;
    } else {
        return object && typeof object === 'object' && object.nodeType === 1 && typeof object.nodeName === 'string';
    };
}

/**
 * url的序列化函数
 * @param {string} url url连接
 */
function parseQueryString(url) {
    var query = {};
    if (typeof url === 'string') {
        var pairs = url.slice(url.indexOf('?')+1).split('&');
        for (var i = 0, len = pairs.length; i < len; i++) {
            var temp = pairs[i].split('=');
            query[temp[0]] = decodeURIComponent(temp[1]);
        };
    }
    return query;
}

/**
 * 反序列化的函数
 * @param {object} dataJson 反序列化的对象
 */
function serialize(dataJson) {
    var dataList = [];
    for (var attr in dataJson) {
        dataList.push(encodeURIComponent(attr) + '=' + encodeURIComponent(dataJson[attr]));
    };
    return dataList.join('&');
}

/**
 * 节流函数
 * @param {functiona} func 需要节流的函数
 * @param {int} wait 等待的时间
 */
function throttle(func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 1;

    var later = function () {
        previous = +new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    return function () {

        var now = +new Date();

        if (!previous) previous = now;

        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;

        }
        else if (!timeout) {
            timeout = setTimeout(later, remaining);
        };

        return result;
    };
}

/**
 * 合并或深拷贝的基础函数
 * @param {object|array} target 合并或深拷贝的目标对象
 * @param {object|array} source 合并或深拷贝的源对象
 */
function baseCloneDeep(target, source) {
    for (var key in source) {
        var temp = Array.isArray(source[key]) ? [] : {};
        if (target.hasOwnProperty(key) && (Array.isArray(target[key]) || typeof target[key] === 'object')) {
            target[key] = baseCloneDeep(target[key], baseCloneDeep(temp, source[key]));
        } else if (Array.isArray(source[key]) || typeof source[key] === 'object') {
            target[key] = baseCloneDeep(temp, source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * 深拷贝和深合并函数
 * @example
 * merge(object1, object2, object3)
 */
function merge() {
    if (arguments[0] === arguments[1] || typeof arguments[0] !== 'object') {
        return false;
    };
    if (!arguments[1]) {
        arguments[1] = arguments[1] || arguments[0];
        arguments[0] = {}
    };
    for (var i = 1, len = arguments.length; i < len; i++) {
        baseCloneDeep(arguments[0], arguments[i])
    };
    return arguments[0];
}

/**
 * 补零参数
 * @param {string|number} num 必选, 需要补零的参数
 * @param {number} len 可选, 补零参数的长度为多小, 不够才会补零, 默认为2
 */
function padZero(num, len = 2) {
    let str = num + '';
    while (str.length < len) {
        str = '0' + str;
    };
    return str;
}

/**
 * 时间格式化
 * @param {Date} timeStamp 必选, 时间戳
 */
function formatTime(timeStamp) {
    let date = new Date(timeStamp);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}

/**
 * 分隔符分隔字符串函数
 * @param {string} value 分隔的字符串
 * @param {number} num 分隔的位数
 * @param {string} mark 分隔的符号
 */
function formatCode(value, num, mark = '-') {
    let source = value.split(mark).join('');
    let result = [];
    for (let i = 0; i < source.length / num; i++) {
        result.push(source.slice(i * num, i * num + num));
    };
    return result.length > 1 ? result.join(mark) : source
}

export { parseQueryString, serialize, throttle, merge, formatTime, padZero, formatCode, isDOMNode, sys };

export default { parseQueryString, serialize, throttle, merge, formatTime, padZero, formatCode, isDOMNode, sys };
