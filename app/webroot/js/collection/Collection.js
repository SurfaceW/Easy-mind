/**
 * @constructor Collection
 * @version 1.0
 * @time 2014-05-26 14:52:53
 * @author TEAM_4
 */
(function () {
    "use strict";

    var URLS = KT.config.urls,

        tool = KT.utils.tool,
        modelPrototype = KT.Model.prototype,

        //Collection构造函数
        Collection = KT.Collection = function (attributes, initializer) {
            this.attributes = attributes || {};
            this.models = [];
            if (typeof initializer === 'function') {
                initializer();
            }
        };

    tool.defaults(Collection.prototype, {
        currentURL : {
            cGraph : URLS.asCGraph,
            freeGraph : URLS.asFGraph
        }
    });

    //Collection类的基本方法
    tool.extend(Collection.prototype, {
        /**
         * Ajax 发送数据
         * @method ajaxSend
         * @param {String} url
         * @param {Object} data
         * @param {Function} success
         * @param {Function} error
         * @param {Object} [option] 其它Ajax配置参数 | 接收一个对象
         * @notice 注意option参数中的配置参数会覆盖之前的参数
         */
        ajaxSend : function (url, data, success, error, option) {
            modelPrototype.ajaxSend.apply(null, arguments);
        },

        /**
         * Ajax 拉取数据
         * @method ajaxGet
         * @param {String} url
         * @param {Function} success
         * @param {Function} error
         * @param {Object} [option] 其它Ajax配置参数 | 接收一个对象
         * @notice 注意option参数中的配置参数会覆盖之前的参数
         */
        ajaxGet : function (url, success, error, option) {
            modelPrototype.ajaxGet.apply(null, arguments);
        },

        /**
         * 向集合之中添加一个对象
         * @param obj
         */
        addModel : function (obj) {
            var length = this.models.length;
            this.models[length] = obj;
        },

        /**
         * 返回符合查询属性的model对象
         * @method getModel
         * @param {String} attr
         * @param {*} value
         * @returns {*}
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
         * @method postActionSequence
         * @param {String} currentView 当前视图的字符串
         * @param {Object} collection 提供对应generateActionSequence()方法返回动作序列的字符串的集合对象
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