/**
 * storage
 * 本地储存数据, 先使用html5的localStorage存储值, 当超出localStorage的限制范围后, 就是使用html5+的plus.storage存储
 */

class Storage {
    /**构造函数 */
    constructor() {
        this.setFail = false;
    }

    /**
     * 储存key的值
     * @param {string} key 键值对中键的值
     * @param {string|int|object|array|function} value 存储的值
     */
    set(key, value) {
        if (key && typeof key === 'string' && value) {
            try {
                window.localStorage.setItem(key, this.stringify(value))
            } catch (e) {
                this.remove(key);
                this.setFail = true;
                window.plus && window.plus.storage.setItem(key, this.stringify(value));
            };
        };
    }

    /**
     * html5+的本地存储方法
     * @param {string} key 键值对中键的值
     * @param {string|int|object|array|function} value 存储的值
     */
    setPlus(key, value) {
        if (window.plus && key && value) {
            window.plus.storage.setItem(key + '', this.stringify(value));
        };
    }

    setAll(key, value) {
        this.set(key, value);
        if (!this.setFail) {
            this.setPlus(key, value);
        };
    }

    /**
     * 获取本地存在key的值
     * @param {string} key 键值对中键的值
     * @param {boolean} update 是否重新获取值或是更新值
     */
    get(key) {
        if (key && typeof key === 'string') {
            return JSON.parse(window.localStorage.getItem(key) || (window.plus && window.plus.storage.getItem(key)) || null);
        };
        return null;
    }

    /**
     * html5+的本地获取方法
     * @param {string} key 键值对中键的值
     */
    getPlus(key) {
        if (window.plus && key && typeof key === 'string') {
            return window.plus.storage.getItem(key);
        };
        return null;
    }

    /**
     * 检测本地是否存在key的值
     * @param {string} key 键值对中键的值
     */
    has(key) {
        if (this.get(key)) {
            return true;
        };
        return false;
    }

    /**
     * 删除本地存在key的值
     * @param {string} key 键值对中键的值
     */
    remove(key) {
        if (key && typeof key === 'string') {
            window.localStorage.removeItem(key)
            window.plus && window.plus.storage.removeItem(key);
        };
    }

    /**清空储存的所有值 */
    clear() {
        window.localStorage.clear();
        window.plus && window.plus.storage.clear();
    }

    /**
     * 序列化函数
     * @param {string|int|object|array|function} val
     */
    stringify(val) {
        return JSON.stringify(val, (key, value) => {
            if (typeof value === 'function') {
                return value + '';
            };
            return value;
        })
    }

}

export default function() {
    return new Storage();
}
