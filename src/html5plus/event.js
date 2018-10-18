/**
 * 注册事件
 */
export default {
    /**
     * 触发webview绑定在document上的事件
     * @param {webviewObject} targetWebview 触发的webview
     * @param {string} eventType 事件名
     * @param {object} data 传递的数据
     */
    fire(targetWebview, eventType, data) {
        if (targetWebview && typeof targetWebview === 'object' && typeof eventType === 'string') {
            targetWebview.evalJS("typeof window.trigger==='function' && trigger(document,'" + eventType + "','" + data + "')");
        }
    },

    /**
     * plus加载完成函数
     * @param {function} callback 回调函数
     */
    plusReady(callback) {
        if (window.plus) {
            callback();
        } else {
            document.addEventListener('plusready', callback, false);
        }
    },

    /**
     * 网络监听函数
     * @param {function} callback 回调函数
     */
    onNetchange(callback) {
        document.addEventListener('netchange', callback, false);
    },

    /**
     * 安卓物理返回键的监听
     * @param {function} callback 回调函数
     */
    onBackButton(callback) {
        plus.key.addEventListener('backbutton', callback, false);
    }
}
