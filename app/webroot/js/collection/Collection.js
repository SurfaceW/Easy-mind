/**
 * Collection构造器
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";

    var URLS = KT.config.urls,

        tool = KT.utils.tool,
        modelPrototype = KT.Model.prototype,

        /**
         * Collection的构造函数，生成一个collection实例（对象）
         *
         * @class KT.Collection
         * @constructor
         * @module KT
         * @param {Object} attributes 初始化属性
         * @param {Function} initializer 初始化执行函数
         * @since 1.0
         */
        Collection = KT.Collection = function (attributes, initializer) {
            this.attributes = attributes || {};
            this.models = [];
            if (typeof initializer === 'function') {
                initializer();
            }
        };

    tool.defaults(Collection.prototype, {
        /**
         * 当前的ActionSequence POST的URL
         * - currentURL.cGraph String
         * - currentURL.freeGraph String
         *
         * @property currentURL
         * @type Object
         */
        currentURL : {
            cGraph : URLS.asCGraph,
            freeGraph : URLS.asFGraph
        }
    });

    //Collection类的基本方法
    tool.extend(Collection.prototype, {
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
        ajaxSend : function (url, data, success, error, option) {
            modelPrototype.ajaxSend.apply(null, arguments);
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
        ajaxGet : function (url, success, error, option) {
            modelPrototype.ajaxGet.apply(null, arguments);
        },

        /**
         * 向集合之中添加一个对象
         *
         * @method addModel
         * @param {Object} obj
         */
        addModel : function (obj) {
            var length = this.models.length;
            this.models[length] = obj;
        },

        /**
         * 返回符合查询属性的model对象
         *
         * @method getModel
         * @param {String} attr
         * @param {*} value
         * @returns {Object}
         */
        getModel : function (attr, value) {
            var i,
                max,
                item;
            for (i = 0, max = this.models.length; i < max; i += 1){
                item = this.models[i];
                if (item[attr] === value) {
                    return this.models[i];
                }
            }
            return null;
        },

        /**
         * 删除对应查询属性的model对象
         *
         * @method removeModel
         * @param {String} attr
         * @param {String} value
         */
        removeModel : function (attr, value) {
            var i;
            for (i = 0; i < this.models.length; i += 1) {
                if (this.models[i][attr] === value) {
                    this.models.splice(this.models.indexOf(this.models[i]), 1);
                }
            }
        },

        /**
         * 发送动作序列给后端
         *
         * @method postActionSequence
         * @param {String} currentView 当前视图的字符串
         * @param {Object} collection 提供对应KT.Collection.prototype.generateActionSequence()方法返回动作序列的字符串的集合对象
         * @param {Function} [success] 响应成功的回调
         * @param {Function} [error] 响应失败的回调
         */
        postActionSequence: function (currentView, collection, success, error) {
            var data = collection.generateActionSequence();
            if (data.data.length === 0) {
                return;
            }
            this.ajaxSend(this.currentURL[currentView], data,  success, error);
        }
    });
}());