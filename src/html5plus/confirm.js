/**
 * 原生的confirm
 * @param {string} title 标题
 * @param {string} message 消息
 * @param {array} buttons 按钮
 * @param {function} callback 回调函数
 * @example
 * nativeConfirm('温馨提示', '您的账号出现异常', ['取消', '重新登录'], index => {
            if (index == 1) {
                
            };
        }
    });
 */
export default function(title, message, buttons, callback) {
    /**判断以及过滤 */
    if (typeof title !== 'string' || !window.plus) {
        return false;
    };

    if (Array.isArray(message)) {
        buttons = message;
        message = title;
        title = '';
    };

    if (typeof message === 'function') {
        callback = message;
        message = title;
        title = '';
    };

    if (typeof buttons === 'function') {
        callback = buttons;
    };

    /**变量的命名 */
    let tags = [];
    let screenWidth = window.innerWidth || document.documentElement.clientWidth;
    let confirmWidth = screenWidth * 0.76;
    let confirmHeight = '155px';
    let titleText = title.slice(0, 12);
    let messageText = message;
    let messageHeight = '65px';
    let messageTop = '45px';
    let confirmButtons = Array.isArray(buttons) ? buttons.slice(0, 3) : ['取消', '确认'];
    let confirmButtonTop = '110px';
    let buttonLength = confirmButtons.length;
    let confirmButtonWidth = confirmWidth / buttonLength;
    let baseFactor = screenWidth / buttonLength;
    
    /**不设置标题时的尺寸 */
    if (!titleText) {
        messageTop = '20px';
        confirmHeight = '135px';
        confirmButtonTop = '85px';
    };

    /**confirm的容器样式设置 */
    tags.push({
        id: 'container',
        tag: 'rect',
        rectStyles: {
            color: '#FFFFFF',
            radius: '3px'
        },
        position: {
            top: '0px',
            left: '0px',
            width: '100%',
            height: confirmHeight
        }
    });

    /**标题的样式设置 */
    if (titleText) {
        tags.push({
            id: 'title',
            tag: 'font',
            text: titleText,
            position: {
                top: '18px',
                left: '8%',
                width: '84%',
                height: '20px'
            },
            textStyles: {
                size: '19px',
                align: 'center',
                color: '#333333'
            }
        });
    };
    
    /**message的样式设置 */
    tags.push({
        id: 'message',
        tag: 'font',
        text: message,
        position: {
            top: messageTop,
            left: '8%',
            width: '84%',
            height: messageHeight
        },
        textStyles: {
            size: '15px',
            align: 'center',
            color: '#666666',
            whiteSpace: 'normal',
            verticalAlign: 'top',
        }
    });

    /**按钮的样式设置以及按钮右边线的样式设置 */
    for (let i = 0; i < buttonLength; i++) {
        /**按钮样式 */
        tags.push({
            id: 'button' + i,
            tag: 'font',
            text: confirmButtons[i],
            position: {
                top: confirmButtonTop,
                left: (confirmButtonWidth * i) + 'px',
                width: confirmButtonWidth + 'px',
                height: '45px'
            },
            textStyles: {
                size: '18px',
                align: 'center',
                color: '#484848'
            }
        });

        /**右边线样式 */
        if (i > 0) {
            tags.push({
                id: 'rightLine' + i,
                tag: 'rect',
                rectStyles: {
                    color: '#CCCCCC'
                },
                position: {
                    top: confirmButtonTop,
                    left: (confirmButtonWidth * i) + 'px',
                    width: '1px',
                    height: '45px'
                }
            });  
        };
    };

    /**按钮顶边线的样式设置 */
    tags.push({
        id: 'buttonTopLine',
        tag: 'rect',
        rectStyles: {
            color: '#CCCCCC'
        },
        position: {
            top: confirmButtonTop,
            left: '0px',
            width: '100%',
            height: '1px'
        }
    });

    /**创建confirm */
    let confirm = new plus.nativeObj.View('confirm', {
        top: '30%',
        left: '12%',
        width: confirmWidth + 'px',
        height: 'wrap_content'
    }, tags);

    /**创建遮罩 */
    let mask = new plus.nativeObj.View('mask', {
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        opacity: 0.5,
        backgroundColor: '#000000'
    });

    /**添加事件 */
    confirm.addEventListener('click', function(e){
        if (typeof callback === 'function') {
            callback(Math.floor((e.pageX + baseFactor) / baseFactor) - 1);
        };
        mask.close();
        mask = null;
        confirm.close();
        confirm = null;
    }, false);

    /**显示confirm */
    mask.show();
    confirm.show();
}