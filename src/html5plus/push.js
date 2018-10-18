/**
 * 推送
 * @param {function} callback 点击回调函数
 */
let isCreate = false;

export default function(callback) {
    plus.push.addEventListener('click', function(msg) {
        //暂时无业务操作
        if (typeof callback === 'function') {
            callback(msg);
        };
    }, false);

    plus.push.addEventListener('receive', function(msg) {
        if (!isCreate && self.$os.ios) {
            plus.push.createMessage(msg.content, msg.payload);
        };
        isCreate = !isCreate;
    }, false);
};
