/**
 * 原生NView进程条组件
 */
class Process {
    constructor() {
        this.tags = this.createTags();
        this.process = this.createProcess();
    }

    /**创建process的view */
    createProcess() {
        return new plus.nativeObj.View('process', {
	        top: '35%',
	        left: '12%',
	        width: '76%',
	        height: 'wrap_content'
	    });
    }

    /**创建Tags */
    createTags() {
        let tags = [];

        /**process的外容器, 数组的索引为0, 表示是外容器 */
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
	            height: '80px'
	        }
        });
        
        /**process的标题, 数组的索引为1, 表示是标题 */
        tags.push({
            id: 'title',
            tag: 'font',
            text: '正在下载',
            position: {
                top: '10px',
                left: '0px',
                width: '100%',
                height: '20px'
            },
            textStyles: {
                size: '17px',
                align: 'center',
                color: '#333333'
            }
        });
        
        /**process的进程条包裹, 数组的索引为2, 表示是进程条包裹 */
        tags.push({
	        id: 'process_wrap',
	        tag: 'rect',
	        rectStyles: {
	            color: '#EEEEEE',
	        },
	        position: {
	            top: '40px',
	            left: '2%',
	            width: '96%',
	            height: '3px'
	        }
	    });
        
        /**process的进程条, 数组的索引为3, 表示是进程条 */
        tags.push({
	        id: 'process',
	        tag: 'rect',
	        rectStyles: {
	            color: '#ff6600',
	        },
	        position: {
	            top: '40px',
	            left: '2%',
	            width: '50%',
	            height: '3px'
	        }
	    });
        
        /**process的底部描述文字, 数组的索引为4, 表示是底部描述文字 */
	    tags.push({
            id: 'percent',
            tag: 'font',
            text: '100%',
            position: {
                top: '53px',
                left: '0px',
                width: '100%',
                height: '20px'
            },
            textStyles: {
                size: '17px',
                align: 'center',
                color: '#333333'
            }
        });

        return tags;
    }

    /**显示组件, 参数对应update方法的参数 */
    show(title, percent, color) {
        this.update(title, percent, color);
        this.process.show();
    }

    /**
     * 更新process组件的样式
     * @param {string} title 显示的标题
     * @param {number} percent 显示的百分比
     * @param {string} color 进程条的颜色
     */
    update(title = '正在下载', percent = 0, color = '#FF6600') {
        this.tags[1].text = title;
        this.tags[3].rectStyles.color = color;
        this.tags[3].position.width = Math.floor(percent * 0.96) + '%';
        this.tags[4].text = percent + '%';
        this.process.draw(this.tags);
    }

    /**关闭清除组件, 释放空间 */
    close() {
        this.process.close();
        this.tags = null;
        this.process = null
    }
}

export default function() {
    return new Process();
}