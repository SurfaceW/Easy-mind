/**
 * freeGraph的View实例
 *
 * @since 1.0
 * @author TEAM-4
 */
(function (globalWindow) {
    "use strict";
    //命名空间转换
    var nodeArgs = KT.config.nodeArgs.FREE_GRAPH,
        nodeArgsFont = KT.config.nodeArgs,

        tool = KT.utils.tool,
        math = KT.utils.math,

        view = KT.view,

        //内部指针
        that,

        //简化函数调用
        getWL = KT.model.window.getWindowLocation,

        /**
         * freeGraph视图
         * + 注意：这个是View的扩展实例
         *
         * @class KT.view.freeGraph
         * @extends KT.View
         * @module KT.view
         * @since 1.0
         */
        freeGraphView = new KT.View();

    /* -------------------- 私有属性 ------------------- */
    tool.extend(freeGraphView, {
        //@todo 应该转移到Controller之中，毕竟是状态机
        animateHoverCircleFinish : true
    });

    /* -------------------- 公有方法 -------------------- */
    tool.extend(freeGraphView, {
        /**
         * 处理鼠标移到节点上的hover动画
         *
         * @method animateHoverCircle
         * @param {Object} o 对象化参数
         * @example
         * o = {
         *  center : Dot,
         *  radius : Number,
         *  radiusStart : Number,
         *  radiusEnd : Number
         * }
         */
        animateHoverCircle : function (o) {
            //----------------------- 基本函数控制 ----------------------------/
            this.animateHoverCircleFinish = false;

            //参数变化
            function update() {
                if (o.radiusStart < o.radiusEnd) {
                    o.radiusStart += 1;
                } else {
                    o.radiusStart -= 1;
                }

            }

            //绘制后面运动的圆圈
            function drawBgCircle() {
                view.canvas.fillCircle({
                    fillStyle: 'rgba(44,44,44,0.1)',
                    center: getWL(o.center),
                    radius: o.radiusStart
                });
            }

            function draw() {
                //整体绘制，并且将绘制底部圆圈的方法置前
                view.freeGraph.drawFreeGraph(drawBgCircle);
            }
            //----------------------- 动画函数控制 -----------------------------
            function animation() {
                update();
                draw();
                if (o.radiusStart !== o.radiusEnd) {
                    globalWindow.requestNextAnimationFrame(animation);
                } else {
                    that.animateHoverCircleFinish = true;
                }
            }
            animation();
        },

        /**
         * 绘制整个视图
         *
         * @method drawFreeGraph
         * @param {Function} [before] 防止clearCanvas的干扰
         */
        drawFreeGraph: function (before) {
            var i, j,
                controller = KT.controller.freeGraph,
                reference = controller.globalReference,
                gData = controller.globalData,
                data,
                item, //遍历对象
                depth, //最高深度
                level;

            //清除Canvas中的全部内容
            view.canvas.clearCanvas();

            //防止上面的清除命令干扰其他的绘制函数的执行
            if ($.isFunction(before)) {
                before();
            }

            //获得该图的最大深度
            depth = reference.findDepth();

            //绘制连线
            for (i = gData.length - 1; i >= 0; i -= 1) {
                item = gData[i];
                level = item.level > 4 ? 4 : item.level;
                view.canvas.fillLine({
                    fillStyle : nodeArgs.LINE_COLOR,
                    lineWidth : nodeArgs.LINE_WIDTH['level' + level],
                    lineJoin : 'round',
                    strokeStyle : nodeArgs.LINE_COLOR,
                    dotStart : getWL(item.center),
                    dotEnd : getWL(reference.getParentNode(item).center)
                });
            }

            //分组Group的ID集合
            for (j = 1; j <= depth; j += 1) {
                //寻找同级节点ID的集合
                data = reference.findLevelNodes(j);

                //绘制圆圈
                for (i = data.length - 1; i >= 0; i -= 1) {
                    item = reference.getNode(data[i]);
                    level = item.level > 4 ? 4 : item.level;
                    view.canvas.fillCircle({
                        fillStyle: nodeArgs.COLOR.background['level' + level],
                        center: getWL(item.center),
                        //设置绘制的圆形的大小
                        radius: item.radius
                    });
                }
            }

            //绘制文字
            for (i = gData.length - 1; i >= 0; i -= 1) {
                item = gData[i];
                level = item.level > 4 ? 4 : item.level;
                view.canvas.fillWords({
                    fillStyle : nodeArgs.FONT.color['level' + level],
                    textBaseline : 'middle',
                    textAlign : 'center',
                    font : nodeArgs.FONT.size['level' + level] + 'px ' + nodeArgsFont.WORDS.FONT_TYPE,
                    text : item.name,
                    center : getWL(item.center),
                    maxRadius : item.radius
                });
            }
        },

        /**
         * 绘制Hover按钮之中的提示效果
         *
         * @method drawHoverHint
         * @param {Dot} position 绘制图形的位置
         * @param {String} type 绘制图形的样式
         */
        drawHoverHint : function (position, type) {
            switch (type) {
                case 'add':
                    view.canvas.fillLine({
                        fillStyle : 'rgb(255,255,255)',
                        lineWidth : 1,
                        strokeStyle : 'rgb(255,255,255)',
                        dotStart : getWL(math.Dot(position.x - 8, position.y)),
                        dotEnd : getWL(math.Dot(position.x + 8, position.y))
                    });
                    view.canvas.fillLine({
                        fillStyle : 'rgb(255,255,255)',
                        lineWidth : 1,
                        strokeStyle : 'rgb(255,255,255)',
                        dotStart : getWL(math.Dot(position.x, position.y + 8)),
                        dotEnd : getWL(math.Dot(position.x, position.y - 8))
                    });
                break;
                case 'delete':
                    view.canvas.fillLine({
                        fillStyle : 'rgb(255,255,255)',
                        lineWidth : 1,
                        strokeStyle : 'rgb(255,255,255)',
                        dotStart : getWL(math.Dot(position.x - 8, position.y)),
                        dotEnd : getWL(math.Dot(position.x + 8, position.y))
                    });
                break;
            }

        }
    });

    KT.view.freeGraph = freeGraphView;
    that = KT.view.freeGraph;
}(window));