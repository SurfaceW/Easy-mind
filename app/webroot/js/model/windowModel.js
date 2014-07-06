/**
 * WindowModel实例
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    var tool = KT.utils.tool,
        math = KT.utils.math,
        Dot = KT.utils.math.Dot,

        that,

        Model = KT.Model,

        /**
         * 窗口Model
         * + 注意：这个是Model的扩展实例
         *
         * @class KT.model.window
         * @extends KT.Model
         * @module KT.model
         * @since 1.0
         */
        windowModel = new Model({
            /**
             * 左上点
             * Note:注意，这是基于Canvas坐标系
             *
             * @property lt
             * @type {Dot}
             */
            lt: null,
            /**
             * 左下点
             * Note:注意，这是基于Canvas坐标系
             *
             * @property lb
             * @type {Dot}
             */
            lb: null,
            /**
             * 右上点
             * Note:注意，这是基于Canvas坐标系
             *
             * @property rt
             * @type {Dot}
             */
            rt: null,
            /**
             * 右下点
             * Note:注意，这是基于Canvas坐标系
             *
             * @property rb
             * @type {Dot}
             */
            rb: null
        });

    //子类方法
    tool.extend(windowModel, {
        /**
         * 重新设置视窗的宽度和高度
         *
         * @method setWindowSize
         */
        setWindowSize: function () {
            //初始化视窗的相对Canvas坐标值
            this.setGroup({
                lt : new Dot(-$(window).width() / 2, $(window).height() / 2),
                rt : new Dot($(window).width() / 2, $(window).height() / 2),
                lb : new Dot(-$(window).width() / 2, -$(window).height() / 2),
                rb : new Dot($(window).width() / 2, -$(window).height() / 2)
            });
        },

        /**
         * 传入两个位移量，并让窗口发生位移
         *
         * @method moveWindow
         * @param {Number} d_x X的Canvas坐标系
         * @param {Number} d_y Y的Canvas坐标系
         */
        moveWindow: function (d_x, d_y) {
            this.lt.x -= d_x;
            this.lt.y += d_y;
            this.rt.x -= d_x;
            this.rt.y += d_y;
            this.lb.x -= d_x;
            this.lb.y += d_y;
            this.rb.x -= d_x;
            this.rb.y += d_y;
        },

        /**
         * 将Canvas标转换为Window坐标对象
         *
         * @method getWindowLocation
         * @param {Dot} dot Canvas坐标体系下的值,Dot对象
         * @returns {Dot}
         */
        getWindowLocation: function (dot) {
            var wc = KT.controller.window,
                x = dot.x * wc.ZOOM_POOL[wc.zoomLevel],
                y = dot.y * wc.ZOOM_POOL[wc.zoomLevel];
            return math.Dot(
                x - that.lt.x,
                that.lt.y - y
            );
        },

        /**
         * 将Window坐标转换为Canvas坐标对象
         *
         * @method getCanvasLocation
         * @param {Dot} dot Window坐标体系下的值,Dot对象
         * @returns {Dot}
         */
        getCanvasLocation: function (dot) {
            var x = dot.x,
                y = dot.y;
            return math.Dot(
                x + that.lt.x,
                that.lt.y - y
            );
        }
    });

    //保存window实例
    KT.model.window = windowModel;
    that = KT.model.window;
}());