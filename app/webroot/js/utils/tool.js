/**
 * @instance tool
 * @version 1.0
 * @time 2014-05-23 21:12:05
 * @author TEAM_4
 */

/**
 *
 */
KT.utils.tool = (function () {
    "use strict";

    var breaker = {}, //设置循环的跳出断点的判断
        slice = Array.prototype.slice; //对原型方法的简化

    return {
        /**
         * 相对应地对象之中添加默认的属性值
         * @notice 如果该属性存在则不予以覆盖
         * @param {Object} obj
         * @returns {*}
         */
        defaults : function (obj) {
            this.each(slice.call(arguments, 1), function(source) {
                var prop;
                if (source) {
                    for (prop in source) {
                        if (source.hasOwnProperty(prop)) {
                            obj[prop] = source[prop];
                        }
                    }
                }
            });
            return obj;
        },

        /**
         * 继承函数
         * @method extend
         * @notice 新的属性会覆盖旧的属性
         * @param {Object} child
         * @returns {*}
         */
        extend : function (child) {
            this.each(slice.call(arguments,1), function (source) {
                var prop;
                if(source) {
                    for (prop in source) {
                        if (source.hasOwnProperty(prop)) {
                            child[prop] = source[prop];
                        }
                    }
                }
            });
            return child;
        },

        /**
         * 遍历函数
         * @method each
         * @param {Object} obj 遍历对象
         * @param {Function} iterator 遍历的迭代函数
         * @param {Object} [context] 遍历对象的上下文切换
         */
        each : function(obj, iterator, context) {
            if (obj === null) {
                return;
            }
            var i, l, key;

            if (obj.length === +obj.length) {
                for (i = 0, l = obj.length; i < l; i+= 1) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) {
                        return;
                    }
                }
            } else {
                for (key in obj) {
                    if (this.has(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) {
                            return;
                        }
                    }
                }
            }
        },

        /**
         * 验证对象是否具有给定属性
         * @method has
         * @param {Object} obj
         * @param {String} key
         * @returns {Boolean}
         */
        has : function(obj, key) {
            return (obj[key] !== undefined);
        },

        /**
         * 删除数组中的对应值的元素
         * @param array
         * @param key
         */
        remove : function (array, key) {
            var i;
            for (i = 0; i < array.length; i += 1) {
                if (array[i] === key) {
                    array.splice(i, 1);
                    i -= 1;
                }

            }
        }
    };
}());