/**
 * Canvas的View实例
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    var ID = KT.config.domString.id,
        nodeArgs = KT.config.nodeArgs,

        utilWindow = KT.model.window,

        tool = KT.utils.tool,

        /**
         * Canvas视图
         * + 注意：这个是View的扩展实例
         *
         * @class KT.view.canvas
         * @extends KT.View
         * @module KT.view
         * @uses KT.utils.tool
         * @uses KT.config.id
         * @uses KT.config.nodeArgs
         * @uses KT.model.window
         * @since 1.0
         */
        canvasView = new KT.View();

    //Canvas视图属性
    tool.defaults(canvasView, {
        /**
         * 保存Canvas画布中的DOM元素
         *
         * @property canvas
         * @type {Object} | jQueryObject
         */
        canvas : null,

        /**
         * 保存Canvas画布中的上下文
         * <p>由函数getContext('2d')返回</p>
         *
         * @property userName
         * @type {Object}
         */
        context : null

    });

    //Canvas视图方法
    tool.extend(canvasView, {
        /**
         * 动画圆形绘制
         *
         * @method animateCircle
         * @param {Object} o
         * @example
         */
        //@todo 这个需要等到以后确定之后进行详细的Example书写
        animateCircle: function (o) {
            var wc = KT.controller.window,
                i,
                max,
                argsArray = [],
                that = this,
                flagCircle = true,
                zoom = wc.ZOOM_POOL[wc.zoomLevel];

            //----------------------- 基本参数设置 -----------------------------
            for (i = 0, max = o.length; i < max; i += 1) {
                argsArray[i] = {
                    animateType: 1,
                    center: o[i].center,
                    radius: (nodeArgs.MAIN.INI_RADIUS + Number(o[i].childNumber)) * zoom,
                    text : o[i].name,
                    radiusCurrent: 0,
                    radiusMax: this.radius,
                    alpha : o[i].alpha,
                    startAngle: -Math.PI,
                    endAngle: Math.PI
                };
            }

            //----------------------- 绘制不变元素 -----------------------------
            function drawBackground() {
                //绘制其它的全局属性
                that.clearCanvas();
            }

            function drawWord() {

                for (i = 0; i < argsArray.length; i += 1) {
                    that.fillWords({
                        fillStyle : nodeArgs.MAIN.FONT.color,
                        textBaseline : 'middle',
                        textAlign : 'center',
                        font : nodeArgs.WORDS.SIZE.level3 * zoom + 'px' + ' ' + nodeArgs.WORDS.FONT_TYPE,
                        text : argsArray[i].text,
                        center : utilWindow.getWindowLocation(argsArray[i].center),
                        maxRadius : (argsArray[i].radius) * zoom
                    });
                }
            }

            //----------------------- 更新函数控制 -----------------------------
            function updateData() {
                var speed, accelerator;
                speed = 2;
                accelerator = 3;
                speed += accelerator;
                for (i = 0; i < argsArray.length; i += 1) {
                    if (argsArray[i].radiusCurrent < argsArray[i].radius) {
                        argsArray[i].radiusCurrent += speed;
                    } else {
                        argsArray[i].radiusCurrent = argsArray[i].radius;
                    }
                }
            }

            function drawChange() {
                for (i = 0; i < argsArray.length; i += 1) {
                    that.fillCircle({
                        fillStyle: "rgba(" + nodeArgs.MAIN.COLOR.base + ',' +
                            argsArray[i].alpha + ")",
                        center: utilWindow.getWindowLocation(argsArray[i].center),
                        //设置绘制的圆形的大小
                        radius: argsArray[i].radiusCurrent
                    });
                }
                drawWord();
            }

            setTimeout(function () {
                flagCircle = false;
            }, 800);

            //----------------------- 动画函数控制 -----------------------------
            function animation() {
                drawBackground();
                drawChange();
                updateData();
                if (flagCircle) {
                    window.requestNextAnimationFrame(animation);
                }
            }
            animation();
        },

        /**
         * 清除画布内的全部内容
         *
         * @method clearCanvas
         */
        clearCanvas: function () {
            this.context.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
        },

        /**
         * 初始化canvas和context对象
         *
         * @method getHandler
         */
        getHandler : function () {
            this.canvas = $(ID.CANVAS_MAIN);
            this.context = this.canvas.get(0).getContext('2d');
        },

        /**
         * 获得canvas画布的宽度
         *
         * @method getCanvasWidth
         * @returns Number
         */
        getCanvasWidth : function () {
            if (!this.canvas) {
                this.getHandler();
            }
            return this.canvas.attr('width');
        },

        /**
         * 获得canvas画布的高度
         *
         * @method getCanvasHeight
         * @returns Number
         */
        getCanvasHeight : function () {
            if (!this.canvas) {
                this.getHandler();
            }
            return this.canvas.attr('height');
        },

        /**
         * 初始化Canvas运行环境
         *
         * @method iniCanvasHandler
         */
        iniCanvasHandler : function () {
            this.getHandler();
            this.setHandler();
        },

        /**
         * 填充一个圆形
         *
         * @method fillCircle
         * @param {Object} o 对象化的参数
         * @example
         * {
         * String fillStyle
         * Dot center
         * Number radius
         * }
         */
        fillCircle : function (o) {
            this.context.fillStyle = o.fillStyle;
            this.context.globalCompositeOperation = o.globalCompositeOperation || 'default';

            this.context.beginPath();
            this.context.moveTo(o.center.x, o.center.y);
            this.context.arc(o.center.x, o.center.y, o.radius, -Math.PI, Math.PI,
                false);
            this.context.moveTo(o.center.x, o.center.y);
            this.context.closePath();

            this.context.fill();
        },

        /**
         * 绘制四个方向的圆环片段
         *
         * @method fillArcCircle
         * @param {Object} o 对象化参数
         * @example
         * o = {
         *  fillStyle : String,
         *  globalCompositeOperation : String,
         *  startIn : Object Dot,
         *  endOut : Object Dot,
         *  radius : Number,
         *  center : Object Dot,
         *  startAngle : Number,
         *  endAngle : Number
         * }
         */
        fillArcCircle : function (o) {
            this.context.fillStyle = o.fillStyle;
            this.context.globalCompositeOperation = o.globalCompositeOperation || 'default';

            this.context.beginPath();
            this.context.moveTo(o.startIn.x, o.startIn.y);
            this.context.arc(o.center.x, o.center.y, o.radius,
                o.startAngle, o.endAngle, false);
            this.context.lineTo(o.endOut.x, o.endOut.y);
            this.context.arc(o.center.x, o.center.y, (o.radius + 8), o.endAngle, o.startAngle, true);
            this.context.lineTo(o.startIn.x, o.startIn.y);
            this.context.closePath();

            this.context.fill();
        },

        /**
         * 绘制直线
         *
         * @method fillLine
         * @param {Object} o 对象化的参数
         * @example
         * {
         * fillStyle : 'String',
         * lineWidth : 'Number',
         * lineJoin : 'String',
         * strokeStyle : 'String',
         * dotStart : 'Dot',
         * dotEnd : 'Dot'
         * }
         */
        fillLine : function (o) {
            var wc = KT.controller.window;

            //设置填充样式(颜色)
            this.context.fillStyle = o.fillStyle;
            //设置绘制线宽
            this.context.lineWidth = o.lineWidth * wc.ZOOM_POOL[wc.zoomLevel];
            //设置交点样式
            this.context.lineJoin = o.lineJoin;
            //设置描边样式
            this.context.strokeStyle = o.strokeStyle;
            this.context.beginPath();
            this.context.moveTo(o.dotStart.x, o.dotStart.y);
            this.context.lineTo(o.dotEnd.x, o.dotEnd.y);
            this.context.closePath();

            this.context.fill();
            this.context.stroke();

        },

        /**
         * 绘制Canvas文字
         *
         * @method fillWords
         * @param {Object} o 对象化的参数
         * @example
         * {
         * String fillStyle 填充样式
         * String textBaseline 文字基线
         * String textAlign 文字对齐
         * String font 文字字形
         * String text 文字内容
         * Dot center 打印文字的中心点
         * Number maxRadius 最大字符宽度
         * }
         */
        fillWords : function (o) {
            //文本填充样式
            this.context.fillStyle = o.fillStyle;
            //文本的基线
            this.context.textBaseline = o.textBaseline;
            //文本的对齐控制
            this.context.textAlign = o.textAlign;
            //文本填充字体
            this.context.font = o.font;
            //绘制文本
            this.context.fillText(o.text, o.center.x, o.center.y, o.maxRadius * 2 - 10);
        },

        /**
         * 设置canvas画布的高度和宽度
         *
         * @method setHandler
         */
        setHandler: function () {
            if (!this.canvas) {
                this.getHandler();
            }
            this.canvas.attr('width', $(window).width())
                .attr('height', $(window).height());
        }
    });
    KT.view.canvas = canvasView;
}());

//requestAnimationFrame 兼容性解决方案
(function () {
    "use strict";
    window.requestNextAnimationFrame = (function () {
        var originalWebkitMethod,
            wrapper,
            geckoVersion = 0,
            userAgent = window.navigator.userAgent,
            index = 0,
            self = this;
        if (window.webkitRequestAnimationFrame) {
            wrapper = function (time) {
                if (time === undefined) {
                    time = new Date();
                }
                self.callback(time);
            };
            originalWebkitMethod = window.webkitRequestAnimationFrame;
            window.webkitRequestAnimationFrame =
                function (callback, element) {
                    self.callback = callback;
                    originalWebkitMethod(wrapper, element);
                };
        }
        if (window.mozRequestAnimationFrame) {
            index = userAgent.indexOf('rv:');
            if (userAgent.indexOf('Gecko') !== -1) {
                geckoVersion = userAgent.substr(index + 3, 3);
                if (geckoVersion === '2.0') {
                    window.mozRequestAnimationFrame = undefined;
                }
            }
        }

        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                var start,
                    finish;
                window.setTimeout(function () {
                    start += new Date();
                    callback(start);
                    finish = +new Date();

                    self.timeout = 1000 / 60 - (finish - start);
                }, self.timeout);
            };
    }());
}());