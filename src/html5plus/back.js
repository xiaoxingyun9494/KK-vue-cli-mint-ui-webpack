/**引入系统检测函数 */
import os from './os';

/**点击的时间 */
let currentTime = 0;
/**关闭动画类型 */
let aniClose = os.ios ? 'pop-out' : 'slide-out-right';

export default function() {
    try {
        let topWebview = plus.webview.getTopWebview();
        let launchWebview = plus.webview.getLaunchWebview();
        
        /**如果当前的webview是首个webview或当前webview的父webview是首个webview, 就按两次再退出程序, 否则直接关闭当前webview */
        if (topWebview === launchWebview || topWebview.parent() === launchWebview) {
            if (!currentTime) {
                currentTime = Date.now();
                plus.nativeUI.toast('再按一次退出应用');
                setTimeout(() => {
                    currentTime = 0;
                }, 1000);
            } else {
                if (Date.now() - currentTime < 1000) {
                    plus.runtime.quit();
                };
            };
        } else {
            topWebview.canBack(e => {
                if(e.canBack && (topWebview.getURL() + '').indexOf('file:///') <= -1 && !plus.webview.getWebviewById('player.html')) {
                    topWebview.back();
                } else {
                    topWebview.close(aniClose, 200);
                };
            });
        };

    } catch(e) {
        console.log('该环境不支持plus, 错误的函数名backButton!');
        history.back();
    };
};
