import os from './os';
import plusWebview from './webview';
import { merge } from '../script/utils';

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
function textTag(id, text, size, top, left, width, color) {
    return {
        tag: "font",
        id: id,
        text: text,
        position: {
            top: top,
            left: left,
            width: width,
            height: '100%'
        },
        textStyles: {
            fontSrc: '_www/fonts/icon.ttf',
            align: 'center',
            size: size,
            color: color
        }
    }
}

/**
 * @param {object} options 创建webview的对象参数, 可参考webview.js文件里的参数注释
 * @param {object} options.styles webview的styles参数, 可以参考5+的webview下的styles属性
 * @param {object} options.styles.titleNView webview的原生标题控件参数, 可以参考5+的webview下的titleNView属性
 * @param {function} options.backCallback 可选, 返回按钮的回调函数, 有个back{function}参数, 如果使用该回调函数必须
 * 执行该函数中的参数函数才会关闭webview
 * @see 其它部分的参数可参考webview.js文件里的参数注释
 */
export default function(options = {}) {
    /**关闭webview的动画 */
    let aniClose = os.ios ? 'pop-out' : 'slide-out-right';

    /**
     * 默认参数
     * @type {object} 默认参数, 可以参考5+的webview下的titleNView属性
     */
    let defaultOptions = {
            titleText: '',
            titleColor: '#333333',
            backgroundColor: '#FFFFFF',
            progress: {
                color: '#FF6600',
                height: '2px'
            },
            splitLine: {
                color: '#CCCCCC',
                height: '1px'
            },
            tags: [
                textTag('icon', '\ue6b8', '20px', '0px', '10px', '15px', '#555555'),
                textTag('back', '返回', '15px', '0px', '25px', '35px', '#555555'),
                textTag('close', '关闭', '15px', '0px', '65px', '35px', '#555555')
            ]
        };

    /**合并参数, 并且打开webview, 并获取webview的值 */
    let titleWebview = plusWebview.open(merge({}, {
            styles: {
                titleNView: defaultOptions    
            }
        }, options));
    
    /**添加webview的title的回调函数, 回调函数的主要意义就是为标题栏添加事件, 因为webview创建后，不是马上创建titleNView
     * 因此, 添加事件会在webview的loaded事件后添加
     */
    plusWebview.on(function(targetWebview) {
        targetWebview.getTitleNView().addEventListener('click', e => {
            //返回按钮
            if (e.pageX >= 10 && e.pageX <= 60) {
                targetWebview.canBack(ev => {
                    /**如果有历史记录, 则返回历史记录, 反之关闭targetWebview */
                    if(ev.canBack) {
                        /**返回历史记录 */
                        targetWebview.back();
                    } else {
                        /**回调函数存在就执行回调函数, 反正关闭targetWebview */
                        if (typeof options.backCallback === 'function') {
                            options.backCallback(function() {
                                targetWebview.close(aniClose, 200);
                            });
                        } else {
                            targetWebview.close(aniClose, 200);
                        };
                    };
                });
            };
            //关闭按钮
            if (e.pageX >= 65 && e.pageX <= 100) {
                /**回调函数存在就执行回调函数, 反正关闭targetWebview */
                if (typeof options.backCallback === 'function') {
                    options.backCallback(function() {
                        targetWebview.close(aniClose, 200);
                    });
                } else {
                    targetWebview.close(aniClose, 200);
                };
            };
        }, false);
    });

    return titleWebview;
}