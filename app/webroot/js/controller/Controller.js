/**
 * Controller构造器
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    var tool = KT.utils.tool,

        /**
         * 控制类构造器
         * <p>此类构造器用于创建<strong>事件控制</strong>类</p>
         *
         * @class KT.Controller
         * @constructor
         * @module KT
         * @uses KT.utils.tool
         * @since 1.0
         */
        Controller = KT.Controller = function () {
            /**
             * 常规事件监听器集合
             *
             * @attribute eventSet
             * @type {{}}
             */
            this.eventSet = {};
            /**
             * 单次触发事件集合
             *
             * @attribute oneShot
             * @type {{}}
             */
            this.oneShot = {};
            /**
             * 操作顺序栈
             *
             * @attribute operations
             * @type {Array}
             */
            this.operations = [];
            /**
             * 操作序列栈长
             *
             * @attribute operationsMaxLength
             * @readOnly
             * @type {number}
             * @default 10
             */
            this.operationsMaxLength = 10;
        };

    //Controller类的方法
    tool.extend(Controller.prototype, {
        /**
         * 添加事件监听器
         *
         * @method addListener
         * @param {String} context 侦听事件的上下文
         * @param {String} name 侦听事件的名称
         * @param {Function} func 对应的回调函数
         */
        addListener : function (context, name, func) {
            $(context).bind(name, func);
            this.eventSet[name] = context;
        },

        /**
         * 绑定单次执行的监听器
         *
         * @method addOneShot
         * @param {String} context 侦听事件的上下文
         * @param {String} name 侦听事件的名称
         * @param {Function} func 对应的回调函数
         */
        addOneShot : function (context, name, func) {
            $(context).one(name, func);
            this.oneShot[name] = context;
        },

        /**
         * 向事件序列之中，添加操作序列
         *
         * @method addOperation
         * @param {Object} data 和事件相关联的数据
         * @param {Function} undoCallback 取消事件操作的回调函数
         * @param {boolean} [referenceObject] 存入的临时数据是否为引用数据 true 是 false 不是
         */
        addOperation : function (data, undoCallback, referenceObject) {
            var obj, clone = {};
            if (!$.isFunction(undoCallback)) {
                undoCallback = function () {};
            }

            if ($.isArray(data)) {
                obj = {
                    data : data,
                    callback : undoCallback
                };
            } else if (!referenceObject) { //注意：不是执行对象引用，而是拷贝对象
                tool.extend(clone, data);
                obj = {
                    data : clone,
                    callback : undoCallback
                };
            } else {
                obj = {
                    data : data,
                    callback : undoCallback
                };
            }

            //撤销操作序列的长度控制
            if (this.operations.length > this.operationsMaxLength) {
                this.operations.unshift(obj);
                this.operations.pop();
            } else {
                this.operations.unshift(obj);
            }
        },

        /**
         * 还原最近的一次操作
         *
         * @method undoOperation
         */
        undoOperation : function () {
            if (this.operations.length === 0) {
                return;
            }
            this.operations[0].callback.call(null, this.operations[0].data);
            this.operations.shift();
        },

        /**
         * 删除并且解绑常规的事件监听器
         *
         * @method removeListener
         * @param {String} name 侦听的事件名称
         */
        removeListener: function (name) {
            $(this.eventSet[name]).unbind(name);
            delete this.eventSet[name];
        },

        /**
         * 清空事件监听器的集合，并且解绑所有的事件
         *
         * @method emptyListener
         */
        emptyListener: function () {
            var name;
            for (name in this.eventSet) {
                if (this.eventSet.hasOwnProperty(name)) {
                    $(this.eventSet[name]).unbind(name);
                    delete this.eventSet[name];
                }
            }
        }
    });
}());

