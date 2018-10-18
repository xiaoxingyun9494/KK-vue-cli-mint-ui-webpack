/**
 * share
 * @example
 * var share = new Share();
 * share.sendShare('weixin', {
 *      title: '分享标题',
 *      content: '分享内容',
 *      thumbs: ['http://192.168.0.123/img.png']
 *      href: 'http://192.168.0.123/index.html'
 * })
 */
class Share {
    /**构造函数 */
    constructor() {
        this._shareServer = [];
        this.getShareServices();
    }

    /**获取分享服务 */
    getShareServices() {
        plus.share.getServices(servers => {
            for (let i in servers) {
                this._shareServer[servers[i].id] = servers[i];
            };
        });
    }

    /**
     * 请求分享服务
     * @param {object} server 分享的服务对象, 如微信, qq等
     * @param {object} dataJson 与sendShare函数的dataJson是一样的值
     */
    requestShareAction(server, dataJson) {
        new Promise((resolve, reject) => {
            if (server.nativeClient) {
                if (server.authenticated) {
                    return resolve();
                } else {
                    server.authorize(() => {
                        return resolve();
                    }, () => reject('授权认证失败!'));
                };
            } else {
                return reject('您尚未安装该应用!');
            };
        }).then(() => {
            server.send(dataJson, () => {}, error => {
                plus.nativeUI.toast('分享失败!');
            });
        }).catch(errorText => {
            plus.nativeUI.toast(errorText);
        });
    }

    /**
     * 发送分享
     * @param {string} type 必选, 可取值: 'weixin', 'weixinf', 'qq', 'sinaweibo'
     * @param {object} dataJson 必选
     * @param {string} dataJson.title  必选, 分享的标题
     * @param {string} dataJson.content 必选, 分享的内容
     * @param {array} dataJson.thumbs 必选, 分享的缩略图, 支持网络地址
     * @param {string} dataJson.pictures 可选, 分享的图片, dataJson.thumbs优先于dataJson.pictures
     * @param {string} dataJson.href 必选, 分享的链接url
     */
    sendShare(type, dataJson = {}) {
        if (type === 'weixin') {
            dataJson.extra = {
                scene: 'WXSceneSession'
            };
        };
        if (type === 'weixinf') {
            type = 'weixin';
            dataJson.extra = {
                scene: 'WXSceneTimeline'
            };
        };
        this._shareServer && this.requestShareAction(this._shareServer[type], dataJson);
    }
}

export default function() {
    return new Share();
}
