/**
 * freeGraphController
 * 自由视图的事件、逻辑控制集
 *
 * @since 2.0 自动化功能版本
 * @author TEAM_4
 */
(function () {
    "use strict";
        //声明依赖
    var ID = KT.config.domString.id,
        nodeArgs = KT.config.nodeArgs,
        URLS = KT.config.urls,
        
        Vector = KT.utils.math.Vector,
        tool = KT.utils.tool,
        math = KT.utils.math,

        model = KT.model,
        collection = KT.collection,
        controller = KT.controller,
        view = KT.view,

        //方法调用化简
        getCL = model.window.getCanvasLocation,
        getWL = model.window.getWindowLocation,

        /**
         * 转换this
         * that = KT.controller.freeGraph
         *
         * @attribute that
         * @private
         */
        that,

        //私有状态机
        /**
         * 表示鼠标在节点上Hover的时刻的所属区域状态
         * @attribute hoverStatus
         * @type {null}
         * @private
         */
        hoverStatus = null,

        /**
         * 表示是否正在添加节点
         * @attribute isAdding
         * @type {boolean}
         * @private
         */
        isAdding = false,

        /**
         * 表示是否处于节点Hovering的指示器
         *
         * @attribute isHovering
         * @type {boolean}
         * @private
         */
        isHovering = false,

        isHold, //存储Hover的时候，用户是否尝试拖拽
        stopHold, //存储上面模式产生的setTimeout返回对象

        /**
         * 表示当前正在拖动节点对象
         *
         * @attribute isDragging
         * @type {boolean}
         * @private
         */
        isDragging = false,

        /**
         * 表示模态框是否被允许显示
         *
         * @attribute allowShowModal
         * @type {boolean}
         * @private
         */
        allowShowModal = true,
        
        /**
         * 实例化freeGraph控制器
         *
         * @method freeNodeGraphController
         */
        freeNodeGraphController = new KT.Controller();

    /**
     * 绑定Hover节点事件
     *
     * @method bindHoverNodeEvent
     * @private
     */
    function bindHoverNodeEvent() {
        that.addListener(ID.CANVAS_MAIN, 'mousemove.nodeHover', function (e) {
            // ---------- 执行条件判定 ----------
            if (isAdding || isDragging) {
                return;
            }

            var cNode, //当前的节点
                dot, //当前鼠标坐标
                i,
                
                center, //当前节点的中心位置
                distance, //当前节点中心到鼠标的距离
                radius, //当前节点的半径

                currentPosition;

            //如果没有节点被选中的情况下
            if (that.hoveredNodeId === null) {
                //计算鼠标的当前相对坐标
                dot = getCL(math.Dot(e.pageX, e.pageY));

                //遍历当前节点数组之中的节点，看节点中是否存在在该半径之中的情况
                for (i = 0; i < that.globalData.length; i += 1) {
                    cNode = that.globalData[i];

                    //如果找到了在某个节点内
                    if (math.findDistance(cNode.center, dot) <= cNode.radius) {
                        // ---------- 状态修改 ----------
                        isHovering = true;

                        that.hoveredNodeId = cNode.id;

                        view.window.mouseChange($(ID.CANVAS_MAIN), 'pointer');
                        view.freeGraph.animateHoverCircle({
                            center : cNode.center,
                            radiusStart : cNode.radius,
                            radiusEnd : cNode.radius + 8
                        });
                        //退出循环
                        break;
                    }
                }

            } else {
                //如果存在Hover的节点id,就需要判定其是否越界
                cNode = that.globalReference.getModel('id', that.hoveredNodeId);
                dot = getCL(math.Dot(e.pageX, e.pageY));

                center = cNode.center;
                distance = math.findDistance(center, dot);
                radius = cNode.radius;

                if (distance > radius + 8) {
                    view.window.mouseChange(ID.CANVAS_MAIN, 'auto');
                    view.freeGraph.animateHoverCircle({
                        center : center,
                        radiusStart : radius + 8,
                        radiusEnd : radius
                    });

                    // ---------- 状态修改 ----------
                    isHovering = false;
                    hoverStatus = null;

                    that.hoveredNodeId = null;

                } else if (distance <= 30) {
                    // ---------- 执行条件判定 ----------
                    if (!view.freeGraph.animateHoverCircleFinish) {
                        return;
                    }

                    hoverStatus = 'center';

                    view.canvas.clearCanvas();
                    view.freeGraph.drawFreeGraph();
                    view.canvas.fillArcCircle({
                        fillStyle : 'rgba(44,44,44,0.1)',
                        startIn : getWL(math.Dot(center.x + radius, center.y)),
                        endOut : getWL(math.Dot(center.x + radius + 8, center.y)),
                        radius : radius,
                        center : getWL(center),
                        startAngle : 0,
                        endAngle : Math.PI * 2
                    });

                } else if (distance > 30 && distance <= radius + 8) {
                    // ---------- 执行条件判定 ----------
                    if (!view.freeGraph.animateHoverCircleFinish) {
                        return;
                    }

                    currentPosition = getCL(math.Dot(e.pageX, e.pageY));
                    //@todo The worst code...
                    switch (math.findQuadrant(center, currentPosition)) {
                    case 1: //如果位于第一象限
                        view.canvas.clearCanvas();
                        view.freeGraph.drawFreeGraph();
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x + radius, center.y)),
                            endOut : getWL(math.Dot(center.x + radius + 8, center.y)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : 0,
                            endAngle : Math.PI * 2
                        });
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x, center.y + radius)),
                            endOut : getWL(math.Dot(center.x + radius + 8, center.y)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : -Math.PI / 2,
                            endAngle : 0
                        });

                        view.freeGraph.drawHoverHint(math.Dot(
                            center.x + radius * 3/4 * 0.7071,
                            center.y + radius * 3/4 * 0.7071
                        ), 'add');
                        hoverStatus = '1';
                        break;
                    case 2:
                        view.canvas.clearCanvas();
                        view.freeGraph.drawFreeGraph();
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x + radius, center.y)),
                            endOut : getWL(math.Dot(center.x + radius + 8, center.y)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : 0,
                            endAngle : Math.PI * 2
                        });
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x - radius, center.y)),
                            endOut : getWL(math.Dot(center.x, center.y + radius + 8)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : -Math.PI,
                            endAngle : -Math.PI / 2
                        });
                        view.freeGraph.drawHoverHint(math.Dot(
                            center.x - radius * 3/4 * 0.7071,
                            center.y + radius * 3/4 * 0.7071
                        ), 'delete');
                        hoverStatus = '2';
                        break;
                    /*
                    case 3:
                        view.canvas.clearCanvas();
                        view.freeGraph.drawFreeGraph();
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x + radius, center.y)),
                            endOut : getWL(math.Dot(center.x + radius + 8, center.y)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : 0,
                            endAngle : Math.PI * 2
                        });
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x, center.y - radius)),
                            endOut : getWL(math.Dot(center.x - radius - 8, center.y)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : Math.PI / 2,
                            endAngle : Math.PI
                        });
                        hoverStatus = '3';
                        break;
                    case 4:
                        view.canvas.clearCanvas();
                        view.freeGraph.drawFreeGraph();
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x + radius, center.y)),
                            endOut : getWL(math.Dot(center.x + radius + 8, center.y)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : 0,
                            endAngle : Math.PI * 2
                        });
                        view.canvas.fillArcCircle({
                            fillStyle : 'rgba(44,44,44,0.1)',
                            startIn : getWL(math.Dot(center.x + radius, center.y)),
                            endOut : getWL(math.Dot(center.x, center.y - radius - 8)),
                            radius : radius,
                            center : getWL(center),
                            startAngle : 0,
                            endAngle : Math.PI / 2
                        });
                        hoverStatus = '4';
                        break;
                     */
                    default:
                        return;
                    }
                }
            }
        });
    }

    /**
     * 绑定拖动节点事件
     *
     * @method bindDragNodeEvent
     * @private
     */
    function bindDragNodeEvent() {
        that.addListener(ID.CANVAS_MAIN, 'mousedown.holdMove', function () {
            isHold = false;

            stopHold = setTimeout(function () {
                isHold = true;
                view.window.mouseChange($(ID.CANVAS_MAIN), 'move');
                //激活拖动Window事件
                $(document).trigger('changeNodeLocationFGraph');
            }, 100);

            //如果鼠标在100ms内弹起那么就会取消上面的事件函数
            that.addOneShot(document, 'mouseup.holdMove', function () {
                if (!isHold) {
                    clearTimeout(stopHold);
                }
            });
        });
        that.addListener(document, 'changeNodeLocationFGraph', function () {
            // ---------- 执行条件判定 ----------
            if (isAdding && !isHovering) {
                return;
            }
            if ((that.focusedNodeId = that.hoveredNodeId) === null) {
                return;
            }

            var ref = that.globalReference,
                currentNode = ref.getModel('id', that.hoveredNodeId),
                parentNode = ref.getParentNode(currentNode),
                allChild,

                positionData = [],
                item,

                vectorA,

                pNode,
                childNode,

                compare = [],

                mousePosition, //鼠标位置
                theta, //旋转角度
                iniMatrix, //初始化的矩阵
                result, //旋转之后的返回的值矩阵
                x,
                y,

                k_1,
                k_2,

                i,
                max;

            //禁止对主节点的位置进行变换
            if (currentNode.id === 0) {
                return;
            }

            //改变私有状态：正在Drag
            isDragging = true;

            allChild = ref.findAllChild(currentNode);

            //防止误操作
            for (i = 0; i < allChild.length; i += 1) {
                item = ref.getModel('id', allChild[i]);
                positionData[i] = {id : allChild[i], center: item.center};
            }
            that.addOperation(positionData, function (data) {
                for (i = 0; i < data.length; i += 1) {
                    item = ref.getModel('id', Number(data[i].id));
                    item.center = data[i].center;
                }
                view.freeGraph.drawFreeGraph();
            });

            //注意：从此之后应该将选中元素的节点删除
            allChild.pop();

            that.addListener(document, 'mousemove.node', function (e) {
                mousePosition = model.window.getCanvasLocation(math.Dot(e.pageX, e.pageY));

                //建立一个表示坐标移动的矢量a
                vectorA = new Vector(currentNode.center, mousePosition);

                //求得旋转的theta角
                theta = math.findTriangleTheta(parentNode.center, currentNode.center, mousePosition);

                //确定是顺时针还是逆时针旋转
                compare[1] = math.Dot(currentNode.center.x - parentNode.center.x,
                    currentNode.center.y - parentNode.center.y);
                compare[2] = math.Dot(mousePosition.x - parentNode.center.x,
                    mousePosition.y - parentNode.center.y);

                k_1 = math.findSlope(parentNode.center, currentNode.center);
                k_2 = math.findSlope(parentNode.center, mousePosition);

                theta = math.findDirection(compare, k_1, k_2, theta);

                //设定当前点的坐标值
                currentNode.center = mousePosition;

                //注意：不能够修改自己的坐标
                for (i = 0, max =  allChild.length; i < max; i += 1) {
                    childNode = ref.getModel('id', allChild[i]); //子节点

                    //对所有的子节点，平移相同的距离
                    x = childNode.center.x + vectorA.vLength * Math.cos(vectorA.theta);
                    y = childNode.center.y + vectorA.vLength * Math.sin(vectorA.theta);

                    childNode.center = math.Dot(x, y);
                }

                for (i = allChild.length - 1; i !== -1; i -= 1) {
                    childNode = ref.getModel('id', allChild[i]);
                    pNode = ref.getParentNode(childNode); //子节点的父节点

                    //对所有的子节点，进行相对于父节点的旋转变换
                    iniMatrix = [[childNode.center.x, childNode.center.y ,1],[0,0,0],[0,0,0]];
                    result = math.transformRotation(iniMatrix, theta, currentNode.center.x, currentNode.center.y);

                    childNode.center.x = result[0][0];
                    childNode.center.y = result[0][1];
                    childNode.change = true;
                }
                view.freeGraph.drawFreeGraph();
            });
            that.addListener(document, 'mouseup.node', function () {
                currentNode.change = true;
                isDragging = false;
                allowShowModal = false;
                //当鼠标松开之后，激发此事件，并解绑鼠标移动所激发的事件
                $(document).unbind('mousemove.node');
            });
        });
    }

    /**
     * 添加新的节点事件
     *
     * @method bindPropertyNodeEvent
     * @private
     */
    function bindClickNodeEvent() {

        view.cGraph.setLocation(ID.MODAL_NODE, $(window).width() - $(ID.MODAL_NODE).width() - 30);

        that.addListener(ID.CANVAS_MAIN, 'click.node', function () {
            // ---------- 执行条件判定 ----------
            if (!isHovering) {
                return;
            }
            
            that.focusedNodeId = that.hoveredNodeId;

            if (hoverStatus === 'center') {
                if (!allowShowModal) {
                    allowShowModal = true;
                    return;
                }
                that.refreshPropertyModel();
                view.freeGraph.show(ID.MODAL_NODE, 'fadeIn', 'fast');
                $(ID.FREENODE_NAME).focus();

            } else if (hoverStatus === '1') {
                //添加节点
                $(ID.CANVAS_MAIN).trigger('addFreeNode');
            } else if (hoverStatus === '2') {
                //删除节点及其子节点
                $(ID.CANVAS_MAIN).trigger('deleteFreeNode');
            } else if (hoverStatus === '3') {
                //前往子视图
                $(ID.CANVAS_MAIN).trigger('gotoSubview');
            } else if (hoverStatus === '4') {
                //创建子视图
                $(ID.CANVAS_MAIN).trigger('createSubview');
            }
        });
    }

    /**
     * 绑定节点属性编辑事件
     *
     * @method bindPropertyChangeEvent
     * @private
     */
    function bindPropertyChangeEvent() {
        function refreshName() {
            var cModel = that.globalReference.getModel('id', that.focusedNodeId),
                nName = $(ID.FREENODE_NAME).val();
            if (nName === cModel.name) {
                return;
            }
            that.addOperation(cModel, function (data) {
                cModel.name = data.name;
                view.freeGraph.drawFreeGraph();
                that.refreshPropertyModel();
            });
            cModel.name = nName;
            view.freeGraph.drawFreeGraph();
            cModel.change = true;
        }

        that.addListener(ID.FREENODE_NAME, 'blur.EditName', function () {
            refreshName();
        });

        //回车保存名称
        that.addListener(ID.FREENODE_NAME, 'keypress.EditName', function (e) {
            if (e.keyCode === 13) {
                refreshName();
            }
        });

        that.addListener(ID.FREENODE_IMPORTANCE, 'change.EditImportance', function () {
            var cModel = that.globalReference.getModel('id', that.focusedNodeId),
                nValue = $(ID.FREENODE_IMPORTANCE).val();
            if (nValue === cModel.importance) {
                return;
            }
            //防止误操作
            that.addOperation(cModel, function (data) {
                cModel.importance = data.importance;
                view.freeGraph.drawFreeGraph();
                that.refreshPropertyModel();
            });
            cModel.importance = nValue;
            view.freeGraph.drawFreeGraph();
            cModel.change = true;
        });
        that.addListener(ID.FREENODE_PROGRESS, 'change.EditProgress', function () {
            var cModel = that.globalReference.getModel('id', that.focusedNodeId),
                nValue = $(ID.FREENODE_PROGRESS).val();
            if (nValue === cModel.progress) {
                return;
            }
            //防止误操作
            that.addOperation(cModel, function (data) {
                cModel.progress = data.progress;
                view.freeGraph.drawFreeGraph();
                that.refreshPropertyModel();
            });
            cModel.progress = nValue;
            view.freeGraph.drawFreeGraph();
            cModel.change = true;
        });
        that.addListener(ID.FREENODE_NOTE, 'click.EditNote', function () {
            console.log('hehe,正在加工制作中！');
        });
    }

    /**
     * 绑定节点添加事件
     *
     * @method bindAddNodeEvent
     * @private
     */
    function bindAddNodeEvent() {
        that.addListener(ID.CANVAS_MAIN, 'addFreeNode', function (e) {
            // ---------- 执行条件判定 ----------
            if (isAdding) {
                return;
            } //如果正在添加节点，则返回

            // ---------- 状态修改 ----------
            isAdding = true;

            var canvasPosition = model.window.getCanvasLocation(math.Dot(e.pageX, e.pageY)),
                focusNodeId = that.focusedNodeId,
                pNode = that.globalReference.getModel('id', focusNodeId),
                newNode;

            newNode = that.globalReference.createFreeNode(pNode, canvasPosition.x, canvasPosition.y);

            //防止误操作
            that.addOperation(newNode, function (data) {
                tool.remove(that.globalReference.createdFNodeId, data.id);
                tool.remove(pNode.childId, data.id);
                that.globalReference.removeModel('id', data.id);
                view.freeGraph.drawFreeGraph();
            });

            view.freeGraph.drawFreeGraph();

            //添加添加节点的按钮事件
            that.addListener(ID.CANVAS_MAIN, 'mousemove.newFreeNode', function (e) {
                newNode.center = model.window.getCanvasLocation(math.Dot(e.pageX, e.pageY));
                view.freeGraph.drawFreeGraph();
            });

            //结束节点的添加的事件
            that.addOneShot(ID.CANVAS_MAIN, 'click.newFreeNode', function () {
                that.removeListener('mousemove.newFreeNode');
                that.globalReference.createdFNodeId.push(newNode.id);
                that.focusedNodeId = newNode.id;
                that.refreshPropertyModel();
                // ---------- 状态修改 ----------
                isAdding = false;
            });
        });
    }

    /**
     * 绑定删除节点事件
     *
     * @method bindDeleteNodeEvent
     * @private
     */
    function bindDeleteNodeEvent() {
        that.addListener(ID.CANVAS_MAIN, 'deleteFreeNode', function () {
            // ---------- 条件预判 ----------
            if (that.focusedNodeId === 0 || that.focusedNodeId === null) {
                return;
            }
            //递归将所有子节点push到临时的数组中，并依次删除
            var ref = that.globalReference,
                cNode = ref.getModel('id', that.focusedNodeId),
                pNode = ref.getParentNode(cNode),
                tempId = ref.findAllChild(cNode),
                i,
                max,
                models = [], //删除备份Models
                item, //遍历的时候的备用对象
                deleteIds,
                createIds;

            //防止误操作
            for (i = 0; i < tempId.length; i += 1) {
                item = ref.getModel('id', tempId[i]);
                models.push(item);
            }
            that.addOperation(models, function (data) {
                for (i = 0; i < data.length; i += 1) {
                    tool.remove(ref.deletedFNodeId, data[i].id);
                    ref.createdFNodeId.push(data[i].id);
                    ref.addModel(data[i]);
                    if (i === data.length - 1) {
                        //小心，必须将删除节点（不是子节点）的父亲对象的childId复原
                        ref.getParentNode(data[i]).childId.push(data[i].id);
                    }
                }
                view.freeGraph.drawFreeGraph();
            }, true);

            //删除选中节点之中的父节点的childId中移除该节点ID
            tool.remove(pNode.childId, cNode.id);

            for (i = 0, max = tempId.length; i < max; i += 1) {
                ref.removeModel('id', tempId[i]);
            }

            //将删除的节点加入已删除数组等待发送至后台
            //如果是全新建立的节点
            deleteIds = ref.deletedFNodeId;
            createIds = ref.createdFNodeId;

            if (createIds.indexOf(that.focusedNodeId) !== -1) {
                createIds.splice(createIds.indexOf(that.focusedNodeId), 1);
            } else {
                //获得被聚焦的Model
                deleteIds.push(that.focusedNodeId);
            }

            //重新绘制自由图
            view.freeGraph.drawFreeGraph();
            view.window.mouseChange(ID.CANVAS_MAIN, 'default');
            //请妥善处理后事儿
            that.focusedNodeId = null;
            that.hoveredNodeId = null;
            //完事后，清空数组
            tempId.length = 0;
        });
    }

    /**
     * 绑定前去子视图的事件
     *
     * @method bindGotoSubView
     * @private
     */
    function bindGotoSubView() {
        that.addListener(ID.CANVAS_MAIN, 'gotoSubview', function () {
        });
    }

    /**
     * 绑定创建子视图的事件
     *
     * @method bindCreateSubview
     * @private
     */
    function bindCreateSubview() {
        that.addListener(ID.CANVAS_MAIN, 'createSubview', function () {
        });
    }

    tool.defaults(freeNodeGraphController, {
        /**
         * 自由视图js引用名称
         *
         * @property name
         * @type {String}
         * @readOnly
         * @default freeGraph
         */
        name : 'freeGraph',

        /**
         * 表示鼠标悬浮之上的节点ID
         *
         * @property hoverNodeId
         * @type {Number}
         */
        hoveredNodeId : null,

        /**
         * 表示聚焦于之上的节点
         *
         * @property focusedNodeId
         * @type {Number}
         */
        focusedNodeId : null,

        /**
         * 存储当前FreeGraph的对象指针
         *
         * @property globalReference
         * @type {Object}
         */
        globalReference : null,

        /**
         * 存储当前FreeGraph的数据指针
         *
         * @property globalData
         * @type {Object}
         */
        globalData : null,

        /**
         * 表示当前的操作模式
         *
         * @property operation
         * @type {String}
         * @default edit
         */
        operation : 'edit'
    });

    tool.extend(freeNodeGraphController, {
        /**
         * 初始化freeNodeGraph界面
         *
         * @method iniFreeGraph
         * @param {Number} id
         */
        iniFreeGraph : function (id) {
            var i, j, k, max, item, childNodes, radius,
                flag = false; //是否有缓存

            for (i = 0; i < KT.collections.length; i += 1) {
                item = KT.collections[i];
                if (item.id === id) {
                    flag = true;
                    break; //注意小心退出循环
                }
            }

            //如果缓存中有数据则执行如下命令
            if (flag === true) {
                //将全局指针引向数据所在位置
                this.globalReference = item;
                this.globalData = item.models;

                //将全局视图设置为freeGraphView
                controller.window.currentView = 'freeGraph';
                that.globalReference.isIni = true;

                //绘制视图并且初始化事件
                view.freeGraph.drawFreeGraph();
                that.iniFreeGraphListener();
            }

            //如果缓存中没有数据
            if (flag === false) {
                //发送AJAX，请求数据
                KT.Model.prototype.ajaxSend(URLS.vaFGraph, {tree_actual_id: id},
                    function (response) {
                        if (response === null) {
                            that.iniCollection(id);
                            that.iniFirstNode(id);
                        } else {
                            that.iniCollection(id);
                            for (i = 0, max = response.length; i < max; i += 1) {
                                j = response[i];

                                if (j.node_child_ids === null) {
                                    childNodes = [];
                                } else {
                                    //解决数据库端有时候返回的字符串开头为' '的情况
                                    if (j.node_child_ids.charAt(0) === ' ') {
                                        childNodes = j.node_child_ids.split(' ').slice(1);
                                    } else {
                                        childNodes = j.node_child_ids.split(' ').slice(0);
                                    }
                                    //类型转换，保证为数字
                                    for (k = 0; k < childNodes.length; k += 1) {
                                        childNodes[k] = Number(childNodes[k]);
                                    }
                                }
                                radius = nodeArgs.FREE_GRAPH.RADIUS['level' + (j.node_level >= 4 ?
                                    4 : Number(j.node_level))];
                                item = {
                                    id : Number(j.node_actual_id),
                                    name : j.node_name,
                                    center: math.Dot(j.node_dot_x, j.node_dot_y),
                                    progress : Number(j.node_progress),
                                    importance : Number(j.node_importance),
                                    parentId : Number(j.node_parent_id),
                                    level : Number(j.node_level),
                                    radius : radius,
                                    note : j.node_note,
                                    childId : childNodes
                                };
                                that.globalData.push(item);
                            }
                        }
                        //将全局视图设置为freeGraphView
                        controller.window.currentView = 'freeGraph';
                        view.freeGraph.drawFreeGraph();
                        that.iniFreeGraphListener();
                        that.globalReference.isIni = true;
                    },
                    function () {
                        //Do Something when Fail
                    });
            }

            //清空操作序列
            this.operations = [];
        },

        /**
         * 初始化事件函数的绑定
         *
         * @method iniFreeGraphListener
         */
        iniFreeGraphListener : function () {
            //绑定窗口拖拽事件
            controller.window.bindDragWindowEvent(that, function () {
                view.freeGraph.drawFreeGraph();
            });

            //绑各类事件
            bindHoverNodeEvent();
            bindClickNodeEvent();
            bindPropertyChangeEvent();

            bindDragNodeEvent();
            bindAddNodeEvent();
            bindDeleteNodeEvent();
            bindCreateSubview();
            bindGotoSubView();
        },

        /**
         * 初始化freeNodeGraph的欣赏试图
         *
         * @method freeNodeGraph
         * @param {Number} id
         */
        iniFreeGraphVisit : function (id) {

        },

        /**
         * 初始化FreeGraphCollection的一个实例，并将全局数据索引指向它
         *
         * @method iniCollection
         * @param {number} id 主视图的ID
         */
        iniCollection : function (id) {
            var item = new KT.FreeNode();
            item.id = id;
            KT.collections.push(item);
            this.globalReference = item;
            this.globalData = item.models;
        },

        /**
         * 在没有任何节点的情况下，初始化第一个节点
         *
         * @method iniFirstNode
         * @param {Number} id
         */
        iniFirstNode : function (id) {
            var newNode = {
                id : 0,
                name : collection.cGraph.getModel('id', id).name,
                center: math.Dot(0,0),
                progress : 0,
                importance : 0,
                parentId : 0,
                level : 1,
                radius : nodeArgs.FREE_GRAPH.RADIUS.level1,
                note : null,
                childId : []
            };
            this.globalData.push(newNode);
            that.globalReference.createdFNodeId.push(newNode.id);
        },

        /**
         * 刷新属性值模态框中的值
         *
         * @method refreshPropertyModel
         */
        refreshPropertyModel : function () {
            var cModel = this.globalReference.getModel('id', that.focusedNodeId);
            $(ID.FREENODE_NAME).val(cModel.name);
            $(ID.FREENODE_IMPORTANCE).val(cModel.importance);
            $(ID.FREENODE_PROGRESS).val(cModel.progress);
        }
    });

    KT.controller.freeGraph = freeNodeGraphController;
    //指针：指向freeGraph
    that = KT.controller.freeGraph;
}());