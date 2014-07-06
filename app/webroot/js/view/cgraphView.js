/**
 * CGraph的View实例
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    //命名空间转换
    var nodeArgs = KT.config.nodeArgs,

        tool = KT.utils.tool,

        view = KT.view,
        windowModel = KT.model.window,
        collection = KT.collection,

        /**
         * CGraph视图
         * + 注意：这个是View的扩展实例
         *
         * @class KT.view.cGraph
         * @extends KT.View
         * @module KT.view
         * @uses KT.utils.tool
         * @uses KT.view
         * @uses KT.collection
         * @uses KT.model.window
         * @since 1.0
         */
        cGraphView = new KT.View();

    /* -------------------- 公有方法 -------------------- */
    tool.extend(cGraphView, {
        /**
         * 绘制用户的Main View
         *
         * @method drawMainGraph
         */
        drawMainGraph : function () {
            //数据引向Collection集合
            var wc = KT.controller.window,
                data = collection.cGraph.models,
                zoom = wc.ZOOM_POOL[wc.zoomLevel],
                item,
                i,
                max;

            view.canvas.clearCanvas();

            //绘制圆圈
            for (i = 0, max = data.length; i < max; i += 1) {
                item = data[i];
                view.canvas.fillCircle({
                    fillStyle: "rgba(" + nodeArgs.MAIN.COLOR.base + ',' + item.alpha + ")",
                    center: windowModel.getWindowLocation(item.center),
                    //设置绘制的圆形的大小
                    radius: (nodeArgs.MAIN.INI_RADIUS + Number(item.childNumber)) * zoom
                });
            }

            //绘制文字
            for (i = 0; i < data.length; i += 1) {

                item = data[i];
                view.canvas.fillWords({
                    fillStyle : nodeArgs.MAIN.FONT.color,
                    textBaseline : 'middle',
                    textAlign : 'center',
                    font : 'normal normal lighter ' + nodeArgs.MAIN.FONT.size * zoom +
                        'px ' + nodeArgs.WORDS.FONT_TYPE,
                    text : item.name,
                    center : windowModel.getWindowLocation(item.center),
                    maxRadius : nodeArgs.MAIN.INI_RADIUS + Number(item.childNumber)
                });
            }
        }
    });

    KT.view.cGraph = cGraphView;
}());