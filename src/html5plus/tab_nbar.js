/**
 * 原生View底部导航条
 */
class NativeNavigation {
    /**
     * 构造函数
     * @param {object} options
     * @param {webviewObject} options.webview tabNView添加的webview
     * @param {string} options.color 默认的图标和字体颜色, 默认值: #555555
     * @param {string} options.active 点击后的图标和字体颜色, 默认值 #ff6600
     * @param {string} options.fontSrc 引入字体文件路径, 不支持网络, 只支持本地, 如: '_www/font/icon.ttf'
     * @param {function} options.callback 点击切换的回调函数, 有回调参数currentIndex, 表示当前的tab索引
     * @param {Array} options.datas 图标和字体的数组数据
     * @param {object} options.datas[0] 数组里的元素为一个对象
     * @param {string} options.datas[0].icon 图标字体, 如: '\ue602'
     * @param {string} options.datas[0].text 描述的文字, 如: '首页'
     */
    constructor(options = {}) {
        
        this.options = Object.assign({
            color: '#555555',
            active: '#FF6600',
            fontSrc: '_www/font/icon.ttf',
            callback: null
        }, options);

        /**添加到的webview, 参数有就用参数, 参数没有就获取当前的 */
        this.webview = this.options.webview || plus.webview.currentWebview();

        this.init();
        
    }

    /**初始化 */
    init() {
        if (this.webview && Array.isArray(this.options.datas)) {
            /**屏幕的宽度值 */
            let screenWidth = window.innerWidth || document.documentElement.clientWidth;
            /**tabNBar的标识 */
            this.tabNBar = this.getTabNBar();
            /**每一个tab的宽度 */
            this.tabWidth = parseFloat(screenWidth / this.options.datas.length);
            /**已经触发的目标索引 */
            this.targetIndex = 0;
            /**tabNBar的subNViewTags的tags */
            this.subNViewTags = this.getSubNViewTags();

            /**添加tabNBar顶部的横线 */
            this.subNViewTags.push({
                tag: 'rect',
                id: 'line',
                color: '#CCCCCC',
                position: {
                    top:'0px',
                    left:'0px',
                    width:'100%',
                    height:'1px'
                }
            });

            /**tabNBar不存在就创建, 并且添加到当前的webview */
            if (!this.tabNBar) {
                this.tabNBar = this.createTabNBar();
                this.webview.append(this.tabNBar)
            }

            /**添加tabNBar事件 */
            this.tabNBar.addEventListener('click', e => {
                this.trigger(Math.floor((e.pageX + this.tabWidth) / this.tabWidth) - 1);
            }, false)
        }
    }

    /**
     * 文本构建函数
     * @param {string} id 唯一标识
     * @param {string} text 文本内容
     * @param {string} size 字体大小
     * @param {string} top 顶部距离
     * @param {string} left 左边距离
     * @param {string} width tab的宽度
     * @param {string} color 字体颜色
     */
    textTag(id, text, size, top, left, width, color) {
        return {
            tag: "font",
            id: id,
            text: text,
            position: {
                top: top,
                left: left,
                width: width,
                height: "24px"
            },
            textStyles: {
                fontSrc: this.options.fontSrc,
                align: "center",
                size: size,
                color: color
            }
        }
    }

    /**获取tabNBar */
    getTabNBar() {
        let subNViews = this.webview.getSubNViews();
        let length = subNViews.length || 0;
        for (let i = 0; i < length; i++) {
            if (subNViews[i].id === 'tabNBar') {
                return subNViews[i];
            }
        };
        return null;
    }

    /**构建并获取SubNViewTags的style属性 */
    getSubNViewTags() {
        let subNViewTags = [];
        for (let i = 0, len = this.options.datas.length; i < len; i++) {
			var left = (this.tabWidth * i) + 'px';
			var width = this.tabWidth + 'px';
			var color = i === 0 ? this.options.active : this.options.color;
			subNViewTags.push(
				this.textTag('font'+i, this.options.datas[i].icon, '24px', '8px', left, width, color),
				this.textTag('subTab'+i, this.options.datas[i].text, '10px', '28px', left, width, color)
			);
        }
        return subNViewTags;
    }

    /**创建tabNBar */
    createTabNBar() {
        return new plus.nativeObj.View('tabNBar', {
            left: '0px',
            width: '100%',
            height: '50px',
            bottom: '0px',
            backgroundColor: '#FFFFFF'
        }, this.subNViewTags);
    }

    /**
     * 重置tabNBar的subNViewTags样式
     * @param {int} currentIndex 当前点击的tab索引
     * @param {int} targetIndex 已经选中的tab目标索引
     */
    resetStyle(currentIndex, targetIndex) {
        this.subNViewTags[currentIndex * 2].textStyles.color = this.options.active;
        this.subNViewTags[currentIndex * 2 + 1].textStyles.color = this.options.active;
        this.subNViewTags[targetIndex * 2].textStyles.color = this.options.color;
        this.subNViewTags[targetIndex * 2 + 1].textStyles.color = this.options.color;
    }

    /**更新tabNBar
     * @param {int} currentIndex 当前点击的tab索引
     */
    updateTabNBar(currentIndex) {
        this.resetStyle(currentIndex, this.targetIndex);
        this.webview.updateSubNViews([{
            id: 'tabNBar',
            tags: this.subNViewTags
        }]);
        this.targetIndex = currentIndex;
    }

    /**
     * 对外开放的点击回调函数
     * @param {function} callback 回调函数
     */
    click(callback) {
        this.options.callback = callback;
    }

    /**触发函数
     * @param {int} currentIndex 当前点击的tab索引或触发的tab索引
     */
    trigger(currentIndex) {
        if (this.targetIndex !== currentIndex) {
            this.updateTabNBar(currentIndex);
            if (typeof this.options.callback === 'function') {
                this.options.callback(currentIndex)
            };
        };
    }

}

 /**对外接口 */
 export default function (options) {
     return new NativeNavigation(options)
 }
