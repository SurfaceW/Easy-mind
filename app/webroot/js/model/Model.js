/**
 * Model构造器
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    var tool = KT.utils.tool;

    /**
     * Model的构造函数，生成一个model实例（对象）
     *
     * @class KT.Model
     * @constructor
     * @module KT
     * @uses KT.utils.tool
     * @param {Object} attributes 初始化属性
     * @param {Function} initializer 初始化执行函数
     * @example
     * var newModel = new Model({a : '22'}, function () { // do something here} });
     * @since 1.0
     */
    KT.Model = function (attributes, initializer) {
        //属性复制
        var item;
        for (item in attributes) {
            if (attributes.hasOwnProperty(item)) {
                this[item] = attributes[item];
            }
        }

        //-------- 创建Model时立刻执行的函数 --------
        if (typeof initializer === 'function') {
            initializer();
        }
    };

    tool.extend(KT.Model.prototype, {
        /**
         * 发送Ajax数据，POST方法
         * 注意：传入数据会被JSON格式化
         *
         * @method ajaxSend
         * @param {String} url 请求URL
         * @param {Object} data 请求数据
         * @param {Function} success 响应成功后的回调函数
         * @param {Function} error 响应失败之后的回调函数
         * @param {Object} [option] 其它Ajax配置参数 | 接收一个配置对象
         */
        ajaxSend: function (url, data, success, error, option) {
            //注意option参数中的配置参数会覆盖之前的参数
            data = JSON.stringify(data);
            var config = {
                type: 'POST',
                url: url,
                dataType: 'json',
                data: data,
                success: success,
                error: error
            };
            tool.defaults(config, option);
            $.ajax(config);
        },

        /**
         * 接收Ajax数据，GET方法，不带参数接收
         * 注意：option参数中的配置参数会覆盖之前的参数
         *
         * @method ajaxGet
         * @param {String} url
         * @param {Function} success 响应成功后的回调函数
         * @param {Function} error 响应失败之后的回调函数
         * @param {Object} [option] 其它Ajax配置参数 | 接收一个配置对象
         */
        ajaxGet: function (url, success, error, option) {
            var config = {
                type: 'POST',
                url: url,
                dataType: 'json',
                success: success,
                error: error
            };
            tool.defaults(config, option);
            $.ajax(config);
        },

        /**
         * 设置一组属性
         *
         * @method setGroup
         * @param {Object} obj 任意对象（包含任意元素）
         */
        setGroup: function (obj) {
            tool.extend(this, obj);
        }
    });
}());
