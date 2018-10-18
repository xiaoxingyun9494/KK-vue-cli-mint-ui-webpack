import process from './process';

function startInstall(url) {
    plus.runtime.install(url, {}, () => {
        plus.runtime.restart();
    }, e => {
        plus.nativeUI.toast('应用安装失败!');
    });
};

export default function(url) {
    let processBar = process();
    let webview = plus.webview.currentWebview();
    let dtask = plus.downloader.createDownload(url, {
            method: 'POST',
            timeout: 6,
            filename: '_doc/update/',
            retryInterval: 3
        });

    processBar.show('开始下载');
    webview.setStyle({ mask: 'rgba(0,0,0,0.2)' });

    function destroyed () {
        processBar.close();
        webview.setStyle({ mask: 'none' });
        webview = null;
        processBar = null;
    };

    dtask.addEventListener('statechanged', (download, status) => {
        if (download.state === 3) {
            processBar.update('正在下载', parseInt((download.downloadedSize / download.totalSize) * 100));
        } else if (download.state === 4) {
            if (status == 200) {
                processBar.update('下载完成, 开始安装', 100);
                setTimeout(function () {
                    destroyed();
                    startInstall(download.filename);
                }, 500);
            } else {
                processBar.update('下载失败, 无法更新');
                setTimeout(function () {
                    destroyed();
                }, 2000);
            };
        };
    }, false);

    dtask.start();
}
