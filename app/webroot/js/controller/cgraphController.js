/**
 * @instance cGraphController
 * @vision 1.0
 * @time 2014-05-22 11:18:22
 * @author TEAM-4
 */
(function () {
    "use strict";
    //命名空间转换
    var ID = KT.config.domString.id,
        nodeArgs = KT.config.nodeArgs,

        tool = KT.utils.tool,
        math = KT.utils.math,

        model = KT.model,
        collection = KT.collection,
        controller = KT.controller,
        view = KT.view,

        that, //KT.controller.cGraph的引用

        cGraphs = KT.collection.cGraph.models,

        isAdding = false, //表示是否正在添加节点的指示器
        isHovering = false, //表示是否处于节点Hovering的指示器
        isDoubleClick = false, //表示双击事件是否已经被激发
        clearSingleClick = null, //单击事件Timer清零

        allowShowModal = true,

        isDragging = false, //存储Hover的时候，用户是否尝试拖拽
        stopHold, //存储上面模式产生的setTimeout返回对象

        //实例化cGraph控制器
        cGraphController = new KT.Controller();

    /**
     * 绑定添加按钮点击事件
     * @private
     */
    function bindAddButtonEvent() {
        that.addListener(ID.CGRAPH_ADD_BUTTON, 'click.addMainView', function (e) {
            // ---------- 执行条件判定 ----------
            if (isAdding) {
                return;
            } //如果正在添加节点，则返回

            // ---------- 状态修改 ----------
            isAdding = true;

            var newNode = collection.cGraph.createNewMainNode(e.pageX, e.pageY);

            //防止误操作
            that.addOperation(newNode, function (data) {
                tool.remove(collection.cGraph.createdNodeId, data.id);
                collection.cGraph.removeModel('id', data.id);
                view.cGraph.drawMainGraph();
            });

            view.cGraph.drawMainGraph();

            //添加添加节点的按钮事件
            that.addListener(ID.CANVAS_MAIN, 'mousemove.newMainNode', function (e) {
                newNode.center = model.window.getCanvasLocation(math.Dot(e.pageX, e.pageY));
                view.cGraph.drawMainGraph();
            });

            //结束节点的添加的事件
            that.addOneShot(ID.CANVAS_MAIN, 'click.newMainNode', function () {
                that.removeListener('mousemove.newMainNode');
                collection.cGraph.createdNodeId.push(newNode.id);
                // ---------- 状态修改 ----------
                isAdding = false;
            });
        });
    }

    /**
     * 绑定Hover节点事件
     * @private
     */
    function bindHoverNodeEvent() {
        var wc = KT.controller.window,
            zoom = wc.ZOOM_POOL[wc.zoomLevel];
        that.addListener(ID.CANVAS_MAIN, 'mousemove.nodeHover', function (e) {
            // ---------- 执行条件判定 ----------
            if (isAdding) { //如果正在添加节点，则返回
                return;
            }

            var dot, //鼠标位置坐标
                i,
                max,
                cNode,

                minDistance;

            //如果没有节点被选中的情况下
            if (controller.cGraph.hoveredNodeId === null) {
                //计算鼠标的当前相对坐标
                dot = math.Dot(e.pageX, e.pageY);

                //遍历当前节点数组之中的节点，看节点中是否存在在该半径之中的情况
                for (i = 0, max = cGraphs.length; i < max; i += 1) {
                    cNode = cGraphs[i];
                    minDistance = (nodeArgs.MAIN.INI_RADIUS + Number(cNode.childNumber)) * zoom;
                    //如果找到了在某个节点内
                    if (math.findDistance(model.window.getWindowLocation(cNode.center), dot) <= minDistance) {

                        // ---------- 状态修改 ----------
                        isHovering = true;
                        controller.cGraph.hoveredNodeId = cNode.id;
                        cNode.alpha = cNode.alpha + nodeArgs.NODE.ALPHA_HOVER;
                        view.cGraph.drawMainGraph();
                        cNode.alpha = cNode.alpha - nodeArgs.NODE.ALPHA_HOVER;
                        view.window.mouseChange($(ID.CANVAS_MAIN), 'pointer');

                        //退出循环
                        break;
                    }
                }
            } else if (controller.cGraph.hoveredNodeId !== null) {
                //如果存在Hover的节点id,就需要判定其是否越界
                cNode = collection.cGraph.getModel('id', controller.cGraph.hoveredNodeId);
                dot = math.Dot(e.pageX, e.pageY);
                minDistance = (nodeArgs.MAIN.INI_RADIUS + Number(cNode.childNumber)) * zoom ;

                if (math.findDistance(model.window.getWindowLocation(cNode.center), dot) > minDistance) {

                    //重新绘制整棵树
                    view.cGraph.drawMainGraph();
                    view.window.mouseChange(ID.CANVAS_MAIN, 'default');

                    // ---------- 状态修改 ----------
                    isHovering = false;
                    controller.cGraph.hoveredNodeId = null;
                }
            }
        });
    }

    /**
     * 单击节点事件
     * @private
     */
    function bindSingleClickNodeEvent() {
        //自动处理：让模态框居中
        view.cGraph.setLocation(ID.CGRAPH_MODAL);

        that.addListener(ID.CANVAS_MAIN, 'click.singleNodeClick', function () {
            // ---------- 执行条件判定 ----------
            if (isAdding || !isHovering) {
                return;
            }
            if (isDoubleClick) {
                isDoubleClick = false;
                return;
            }
            //清除上一个单击事件
            clearTimeout(clearSingleClick);

            clearSingleClick = setTimeout(function () {
                controller.cGraph.focusedNodeId = controller.cGraph.hoveredNodeId;
                controller.cGraph.refreshMainNodeModal();
                if (allowShowModal) {
                    view.cGraph.show(ID.CGRAPH_MODAL);
                    $(ID.CGRAPH_NAME).focus();
                } else {
                    allowShowModal = true;
                }
            }, 180);
        });
        // ---------- 执行条件判定 ----------
        if (controller.cGraph.operation === 'edit') {
            //保存主图属性
            that.addListener(ID.CGRAPH_SAVE, 'click.saveMainNodeModal', function () {
                controller.cGraph.saveMainNodeModal();
            });
            that.addListener(ID.CGRAPH_NAME, 'keypress.saveMainNodeModal', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    controller.cGraph.saveMainNodeModal();
                }
            });
            //删除某一主图
            that.addListener(ID.CGRAPH_DELETE, 'click.deleteMainNodeModal', function () {
                controller.cGraph.deleteMainNodeModal();
            });
        }
    }

    /**
     * 双击节点事件
     * @private
     */
    function bindDoubleClickNodeEvent() {
        that.addListener(ID.CANVAS_MAIN, 'dblclick.doubleNodeClick', function () {
            // ---------- 执行条件判定 ----------
            if (isAdding || !isHovering) {
                return;
            }

            //停止掉单击事件的激发
            clearTimeout(clearSingleClick);
            isDoubleClick = true;

            view.window.mouseChange(ID.CANVAS_MAIN, 'default');
            view.cGraph.hide(ID.CGRAPH_MODAL);

            that.focusedNodeId = that.hoveredNodeId;
            controller.cGraph.gotoFreeGraph();
        });
    }

    /**
     * 绑定拖动节点事件
     * @private
     */
    function bindDragNodeEvent() {
        that.addListener(ID.CANVAS_MAIN, 'mousedown.dragNode', function () {
            // ---------- 执行条件判定 ----------
            if (!isHovering) {
                return;
            }
            if (isAdding) {
                return;
            }

            stopHold = setTimeout(function () {
                // ---------- 状态修改 ----------
                isDragging = true;
                view.window.mouseChange(ID.CANVAS_MAIN, 'move');
                //激活拖动Window事件
                $(document).trigger('changeNodeLocationCGraph');

            }, 140);

            that.addOneShot(ID.CANVAS_MAIN, 'mouseup.holdMove', function () {
                if (!isDragging) {
                    clearTimeout(stopHold);
                }
            });
        });

        //自定义激活事件：改变节点位置的事件
        that.addListener(document, 'changeNodeLocationCGraph', function () {
            if ((controller.cGraph.focusedNodeId = controller.cGraph.hoveredNodeId) === null) {
                return;
            }

            //如果是主节点，则不允许移动
            var currentNode = collection.cGraph.getModel('id', controller.cGraph.hoveredNodeId);

            //防止误操作
            that.addOperation(currentNode, function (data) {
                currentNode.center = data.center;
                view.cGraph.drawMainGraph();
            });
            view.window.mouseChange($(ID.CANVAS_MAIN), 'drag');
            that.addListener(document, 'mousemove.node', function (e) {
                //将视窗左边转化为Canvas坐标
                currentNode.center = model.window.getCanvasLocation(math.Dot(e.pageX, e.pageY));
                view.cGraph.drawMainGraph();
            });
            that.addOneShot(document, 'mouseup.node', function () {
                that.removeListener('mousemove.node');
                currentNode.change = true;
                // ---------- 状态修改 ----------
                isDragging = false;
                allowShowModal = false;
            });
        });
    }

    tool.defaults(cGraphController, {
        name : 'cGraph',
        //表示鼠标悬浮之上的节点ID
        hoveredNodeId : null,
        //表示聚焦于之上的节点
        focusedNodeId : null,
        //表示当前的操作模式
        operation : 'edit'
    });

    tool.extend(cGraphController, {
        /**
         * 跳转到FreeGraph视图
         * @method gotoFreeGraph
         */
        gotoFreeGraph : function () {
            //清除当前页面的监听器
            this.emptyListener();
            //删除CGraph Drag Window的事件
            controller.window.removeDragWindowEvent();

            var m = collection.cGraph.getModel('id', this.focusedNodeId);

            view.window.hide(ID.CGRAPH_ADD_BUTTON).show(ID.ICON_BACK);
            collection.cGraph.postActionSequence('cGraph', collection.cGraph);

            if (controller.cGraph.operation === 'edit') {
                controller.freeGraph.iniFreeGraph(this.focusedNodeId);
            } else {
                controller.freeGraph.iniFreeGraphVisit(this.focusedNodeId);
            }

            //处理Hover id的滞留问题
            this.focusedNodeId = null;
            this.hoveredNodeId = null;
        },

        /**
         * 初始化CGraph界面以及CGraph的数据
         * @param {Object} response 期望的参数是来自userModel的login函数传参: response[2]
         * @method iniCGraph
         */
        iniCGraph : function (response) {
            var i,
                max,
                newCgraph,
                newModel,

                wc = controller.window;

            //如果为新建主图，则自动添加根节点
            if (response === null) {
                newCgraph = {
                    id : 0,
                    name : '现在只剩下我了',
                    tag : '',
                    center : math.Dot(0, 0),
                    childNumber : 0,
                    alpha: nodeArgs.MAIN.COLOR['level' + math.selectRange(0)],

                    //前端属性
                    display : false, //判定该节点是否在当前视窗中
                    change : false //为AS序列的判断奠定基础
                };
                newModel = new KT.Model(newCgraph);
                collection.cGraph.models.push(newModel);
                collection.cGraph.createdNodeId.push(0);
            } else {
                for (i = 0, max = response.length; i < max; i += 1) {
                    newCgraph = {
                        id : parseInt(response[i].tree_actual_id, 10),
                        name : response[i].tree_name,
                        tag : response[i].tree_tags,
                        center : math.Dot(response[i].tree_dot_x * wc.ZOOM_POOL[wc.zoomLevel], response[i].tree_dot_y * wc.ZOOM_POOL[wc.zoomLevel]),
                        childNumber : Number(response[i].tree_node_sums),
                        alpha: nodeArgs.MAIN.COLOR['level' +
                            math.selectRange(parseInt(response[i].tree_node_sums, 10))],

                        //前端属性
                        display : false, //判定该节点是否在当前视窗中
                        change : false //为AS序列的判断奠定基础
                    };
                    newModel = new KT.Model(newCgraph);
                    collection.cGraph.models.push(newModel);
                }
            }
            view.window.hide(ID.WELCOME);
            this.isIni = true;
            //清空操作序列
            this.operations = [];
            this.iniCGraphOperation();
            collection.cGraph.isIni = true;
        },

        /**
         * 执行CGraph的初始化UI/事件操作
         * @method iniCGraphOperation
         */
        iniCGraphOperation : function () {
            //显示画布和添加按钮
            view.cGraph.show(ID.CANVAS_WHOLE).hide(ID.ICON_BACK).show(ID.CGRAPH_ADD_BUTTON);

            //绘制动画的圆形出现
            view.canvas.animateCircle(cGraphs);

            //将全局视图设置为mainView
            controller.window.currentView = 'cGraph';

            //禁用文字选择功能
            $('.modal').bind('selectstart', function () {
                return false;
            });

            //延迟执行事件绑定，直到动画效果完毕
            setTimeout(function () {
                //------------ 条件预判 --------------
                if (that.operation === 'edit') {
                    //绑定添加节点按钮事件
                    bindAddButtonEvent();
                    bindDragNodeEvent();
                }

                //绑定事件流
                bindHoverNodeEvent();
                bindSingleClickNodeEvent();
                bindDoubleClickNodeEvent();

                //绑定窗口拖拽事件
                controller.window.bindDragWindowEvent(controller.cGraph, function () {
                    view.cGraph.drawMainGraph();
                });
            }, 300);
        },

        hoverTest : function () {
            that.removeListener('mousemove.nodeHover');
            bindHoverNodeEvent();
        },

        /**
         * 初始化该试图的造访者试图
         */
        iniVisitCGraph : function (id) {
            this.operation = 'visit';
            this.iniCGraph(id);
        },

        /**
         * 点击保存按钮触发的事件
         */
        saveMainNodeModal : function () {
            //获得被聚焦的Model
            var item = collection.cGraph.getModel('id', controller.cGraph.focusedNodeId);

            //防止误操作
            this.addOperation(item, function (data) {
                item.name = data.name;
                item.tag = data.tag;
                view.cGraph.drawMainGraph();
            });

            item.name = $(ID.CGRAPH_NAME).val();
            //表示item的name属性发生了修改
            item.change = true;


            view.cGraph.drawMainGraph();
            //保存完后隐藏cGraph_modal
            view.cGraph.hide(ID.CGRAPH_MODAL);
        },

        /**
         * 刷新cGraph_modal中的值
         */
        refreshMainNodeModal : function () {
            //获得被聚焦的Model
            var item = collection.cGraph.getModel('id', controller.cGraph.focusedNodeId);

            // ---------- 执行条件判定 ----------
            if (item === null) {
                return;
            }
            $(ID.CGRAPH_NAME).val(item.name);
            $(ID.CGRAPH_TAG).val(item.tag);
        },

        /**
         * 点击删除按钮触发的删除事件
         */
        deleteMainNodeModal : function () {
            //防止误操作
            that.addOperation(collection.cGraph.getModel('id', controller.cGraph.focusedNodeId), function (data) {
                tool.remove(collection.cGraph.deletedNodeId, data.id);
                collection.cGraph.models.push(data);
                view.cGraph.drawMainGraph();
            }, true);

            collection.cGraph.removeModel('id', controller.cGraph.focusedNodeId);
            //如果是全新建立的节点
            if (collection.cGraph.createdNodeId.indexOf(controller.cGraph.focusedNodeId) !== -1) {
                collection.cGraph.createdNodeId.splice(
                    collection.cGraph.createdNodeId.indexOf(controller.cGraph.focusedNodeId), 1);
            } else {
                //获得被聚焦的Model
                collection.cGraph.deletedNodeId.push(controller.cGraph.focusedNodeId);
            }
            view.cGraph.drawMainGraph();

            //删除完后隐藏cGraph_modal
            view.cGraph.hide(ID.CGRAPH_MODAL);
            controller.cGraph.focusedNodeId = null;
            controller.cGraph.hoveredNodeId = null;
        }
    });

    KT.controller.cGraph = cGraphController;
    that = KT.controller.cGraph;
}());