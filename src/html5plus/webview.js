import { merge, sys } from '../script/utils';

class OpenWebview {
    /**构造函数 */
    constructor() {
        /**os检测 */
        this.os = sys;

        /**默认参数标识 */
        this.options = null;

        /**webview显示动画 */
        this.aniShow = this.os.isIOS ? 'pop-in' : 'slide-in-right';

        /**webview标识 */
        this.targetWebview = null;
    }

    /**设置默认参数 */
    defaultOptions() {
        return {
            data: null,
            styles: {
                render: 'always',
                errorPage: '_www/views/error.html',
                popGesture: 'none',
                plusrequire: 'ahead',
                videoFullscreen: 'auto',
                scrollIndicator: 'none',
                decelerationRate: this.os.isIOS ? 0.001 : 0.989,
                backButtonAutoControl: 'none'
            },
            showCallback: null
        };
    }

    /**对外的方法体 */
    open(options = {}) {
        try {
            /**id为空, 直接停止执行 */
            if (!options.id) {
                return false;
            };

            /**赋值默认参数 */
            this.options = merge({}, this.defaultOptions(), options);

            /**创建或打开webview的业务 */
            if (this.getWebview(options.id)) {
                this.targetWebview.show(this.aniShow, 200, this.options.showCallback);
            } else {
                this.targetWebview = this.createWebview(this.options);
                this.targetWebview.addEventListener('loaded', this.loadedEventFn.bind(this), false);
            };
        } catch(e) {
            console.log('该环境创建webview失败或不支持创建!');
        };

        return this.targetWebview;
    }

    /**获取webview */
    getWebview(id) {
        this.targetWebview = plus.webview.getWebviewById(id + '');
        return this.targetWebview;
    }

    /**
     * 创建webview
     * @param {object} options
     * @param {object} options.data webview之间的传值通讯
     * @param {object} options.styles webveiw创建的样式, 具体参数可以参考5+的webview文档
     * @param {function} options.showCallback webview显示后的回调函数
     */
    createWebview(options) {
        return plus.webview.create(options.url, options.id, options.styles, options.data);
    }

    /**
     * webveiw加载成功后的回调函数
     * @param {event} e
     */
    loadedEventFn(e) {
        this.targetWebview.show(this.aniShow, 200, e => {
            if (typeof this.titleCallback === 'function') {
                this.titleCallback(this.targetWebview);
            };
            if (typeof this.options.showCallback === 'function') {
                this.options.showCallback(this.targetWebview);
            };
        });
        this.targetWebview.removeEventListener('loaded', this.loadedEventFn.bind(this), false);
    }

    /**开放给titleWebview的回调, 主要是为了给原生标题栏添加事件 */
    on(callback) {
        this.titleCallback = callback;
    }

}

export default new OpenWebview()
