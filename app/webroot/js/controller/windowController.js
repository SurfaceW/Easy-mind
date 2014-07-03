/**
 * @instance windowController
 * @version 1.0
 * @time 2014-05-26 14:55:44
 * @author TEAM_4
 */
(function () {
    "use strict";
    //命名空间转换
    var ID = KT.config.domString.id,
        CLASS = KT.config.domString.classes,

        tool = KT.utils.tool,

        model = KT.model,
        collection = KT.collection,
        controller = KT.controller,
        view = KT.view,

        that,

        isDrag, //存储Window的状态，是否是Drag状态
        stopDrag, //存储setTimeout的返回对象

        windowController = new KT.Controller();

    /**
     * 绑定窗口RESIZE事件
     * @private
     */
    function bindResizeEvent() {
        that.addListener(window, 'resize.Window', function () {
            //当用户改变窗口尺寸的时候更新Window的Model数据
            model.window.setWindowSize();
            //重新设置Canvas的尺寸
            view.canvas.iniCanvasHandler();
            //让全局模态框消失，防止位移干扰
            view.window.hide(CLASS.MODAL_ALL, 'hide');

            switch (controller.window.currentView) {
            //重新整理更新了Model之后的数据
            case 'welcome':
                view.welcome.resize();
                break;
            case 'cGraph':
                view.cGraph.drawMainGraph();
                break;
            case 'freeGraph':
                view.freeGraph.drawFreeGraph();
                break;
            default:
                return;
            }
        });
    }

    /**
     * 绑定ICON点击事件和动画
     * @private
     */
    function bindIconClickEvent() {
        view.window.setLocation(ID.MODAL_USER);
        view.window.setLocation(ID.MODAL_EXPORT);
        //需要各个重设

        that.addListener(ID.ICON_MENU, 'click.iconMenu', function () {
            view.window.toggleMenu();
        });
        that.addListener(ID.ICON_PLUS, 'click.iconPlus', function () {
            if (that.zoomLevel >= 0 && that.zoomLevel < 14){
                console.log('plus' + that.zoomLevel);
                that.zoomLevel = that.zoomLevel + 1;
            } else {
                return;
            }
            if (controller.window.currentView === 'cGraph') {
                controller.cGraph.hoverTest();

                view.cGraph.drawMainGraph();
            } else if (controller.window.currentView === 'freeGraph') {
                view.freeGraph.drawFreeGraph();
            }
            model.window.setWindowSize();

        });
        that.addListener(ID.ICON_MINUS, 'click.iconMinus', function () {
            if (that.zoomLevel > 0 && that.zoomLevel <= 14){
                console.log('minus' + that.zoomLevel);
                that.zoomLevel = that.zoomLevel - 1;
            } else {
                return;
            }
            if (controller.window.currentView === 'cGraph') {
                controller.cGraph.hoverTest();
                view.cGraph.drawMainGraph();
            } else if (controller.window.currentView === 'freeGraph') {
                view.freeGraph.drawFreeGraph();
            }

        });
        that.addListener(ID.ICON_FULL_SCREEN, 'click.iconFullScreen', function () {
            that.fullScreen();
        });
        that.addListener(ID.ICON_USER, 'click.iconUser', function () {
            //view.window.show(ID.MODAL_USER, 'fadeIn', 300);
        });
        that.addListener(ID.MENU_SAVE, 'click.saveData', function () {
            if (controller.window.currentView === 'cGraph') {
                collection.cGraph.postActionSequence('cGraph', collection.cGraph);
            } else if (controller.window.currentView === 'freeGraph') {
                collection.cGraph.postActionSequence('freeGraph', controller.freeGraph.globalReference);
            }
        });
        that.addListener(ID.MENU_UNDO, 'click.undo', function () {
            controller[that.currentView].undoOperation();
        });
        that.addListener(ID.MENU_LOGOUT, 'click.logout', function () {
            localStorage.removeItem('userMail');
            localStorage.removeItem('userPassword');
            window.location.reload();
        });
        that.addListener(ID.ICON_BACK, 'click.backToMain', function () {
            //清空本视图的Listener
            controller.freeGraph.emptyListener();
            //清空Window之中的事件侦听
            controller.window.removeDragWindowEvent();
            //发送保存请求
            collection.cGraph.postActionSequence('freeGraph', controller.freeGraph.globalReference);
            //隐藏可能已经出现的节点属性框
            view.window.hide(ID.MODAL_NODE);
            //初始化主视图的内容
            controller.cGraph.iniCGraphOperation();
        });
    }

    /**
     * 绑定快捷方式
     * @method bindShortcutsEvent
     */
    function bindShortcutsEvent() {
        that.addListener(document, 'keydown.shortcuts', function (e) {
            //ctrl + s 保存操作
            if (e.ctrlKey && e.which === 83) {
                e.preventDefault();
                if (controller.window.currentView === 'cGraph') {
                    collection.cGraph.postActionSequence('cGraph', collection.cGraph);
                } else if (controller.window.currentView === 'freeGraph') {
                    collection.cGraph.postActionSequence('freeGraph', controller.freeGraph.globalReference);
                }
            }
            //ctrl + z 撤销操作
            if (e.ctrlKey && e.which === 90) {
                e.preventDefault();
                controller[that.currentView].undoOperation();
            }
            //ctrl + enter 全屏
            if (e.ctrlKey && e.which === 13) {
                e.preventDefault();
                that.fullScreen();
            }
        });
    }

    /**
     * 绑定modal的关闭事件，并在关闭前保存modal数据
     * @method bindCloseClickEvent
     */
    function bindCloseClickEvent() {
        that.addListener(ID.CGRAPH_CLOSE, 'click.cGraphModalClose', function () {
            view.window.hide(ID.CGRAPH_MODAL);
        });
        that.addListener(ID.FREENODE_CLOSE, 'click.freeGraphModalClose', function () {
            view.window.hide(ID.MODAL_NODE);
        });
        that.addListener(ID.USER_CLOSE, 'click.userClose', function () {
            view.window.hide(ID.MODAL_USER);
        });
    }

    /**
     * 绑定modal的拖动事件
     * @method bindAllModalDraggable
     * @private
     */
    function bindAllModalDraggable() {
        that.addListener(CLASS.MODAL_ALL_HEADER, 'mouseenter.drag', function () {

            var currentHeader = $(this),
                currentModal = $(this).parent();

            view.window.mouseChange(currentHeader, 'move');
            that.addListener(document, 'mousedown.dragModal', function () {
                $(document).trigger('dragModal');

                that.addOneShot(document, 'mouseup.dragModal', function () {
                    //当用户拖拽完毕之后，解绑监听鼠标移动的事件
                    that.removeListener('mousemove.dragModal');
                });
            });
            that.addListener(document, 'dragModal', function () {
                var //模态框的窗口位置坐标
                    x1 = Number(currentModal.css('left').split('px')[0]),
                    y1 = Number(currentModal.css('top').split('px')[0]),
                    //保证相对距离的迅速按只执行一次
                    flag = true,
                    //鼠标与模态框的相对位置距离
                    dx,
                    dy;

                //为窗口绑定鼠标移动事件，以确定鼠标位移
                that.addListener(document, 'mousemove.dragModal', function (e) {
                    if (flag) {
                        dx = e.pageX - x1;
                        dy = e.pageY - y1;
                        flag = false;
                    }

                    //进行鼠标偏移量计算
                    x1 = e.pageX - dx;
                    y1 = e.pageY - dy;

                    //判定模态框是否越界
                    if (x1 <= 0) {
                        x1 = 0;
                    }
                    if (y1 <= 0) {
                        y1 = 0;
                    }
                    if (x1 + currentModal.width() > $(window).width()) {
                        x1 = $(window).width() - currentModal.width() - 10;
                    }
                    if (y1 + currentModal.height() > $(window).height()) {
                        y1 = $(window).height() - currentModal.height() - 10;
                    }
                    currentModal.css({
                        left : x1 + 'px',
                        top : y1 + 'px'
                    });
                });
            });
        });
        that.addListener(CLASS.MODAL_ALL_HEADER, 'mouseleave.drag', function () {
            that.removeListener('dragModal');
            that.removeListener('mousedown.dragModal');
        });
    }

    /**
     * 绑定modal内的按钮事件
     * @method bindModalButtonEvents
     */
    function bindModalButtonEvents() {
    }


    tool.defaults(windowController, {
        //用于表示当前Window所处环境
        /*
         一共有如下的属性值：String
         welcome : 表示正处于欢迎视图
         cGraph : 用户选择主要视图
         freeGraph : 自由图编辑视图
         */
        currentView : null,

        //缩放相关
        ZOOM_POOL : [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5],

        zoomLevel : 6
    });

    tool.extend(windowController, {
        /**
         * 初始化Window事件体系
         * @method iniWindowController
         */
        iniWindowController : function () {
            model.window.setWindowSize();

            bindResizeEvent();
            bindIconClickEvent();
            bindShortcutsEvent();
            bindCloseClickEvent();
            bindAllModalDraggable();
            bindModalButtonEvents();
        },

        /**
         * 绑定拖动Window的事件
         * @method bindDragWindowEvent
         * @param context 事件绑定的上下文
         * @param redrawF 更新绘制事件
         */
        bindDragWindowEvent : function (context, redrawF) {
            this.addListener(document, 'dragWindow', function () {
                //存储鼠标上一次的位置
                var lastMoveX = null,
                    lastMoveY = null;

                //当鼠标移出CANVAS MAIN之后，触发结束事件
                that.addOneShot(ID.CANVAS_MAIN, 'mouseout.dragWindow', function () {
                    $(ID.CANVAS_MAIN).trigger('mouseup.dragWindow');
                });
                //为窗口绑定鼠标移动事件，以确定鼠标位移
                that.addListener(ID.CANVAS_MAIN, 'mousemove.dragWindow', function (e) {
                    if (lastMoveX === null || lastMoveY === null) {
                        lastMoveX = e.pageX;
                        lastMoveY = e.pageY;
                    }

                    //更新Window Model的新的坐标位置
                    model.window.moveWindow((e.pageX - lastMoveX), (e.pageY - lastMoveY));

                    //移动的时候动态绘制当前视图
                    if ($.isFunction(redrawF)) {
                        redrawF();
                    }

                    //注意：必须替换旧坐标的新值
                    lastMoveX = e.pageX;
                    lastMoveY = e.pageY;
                });
            });
            this.addListener(ID.CANVAS_MAIN, 'mousedown.dragWindow', function () {
                isDrag = false;

                //如果鼠标松开，判定是单击还是长按，并执行对应的函数
                that.addOneShot(ID.CANVAS_MAIN, 'mouseup.dragWindow', function () {
                    //如果是快速点击，停止激发拖拽窗口事件
                    if (!isDrag) {
                        clearTimeout(stopDrag);
                    } else {
                        //当用户拖拽完毕之后，解绑监听鼠标移动的事件
                        view.window.mouseChange($(ID.CANVAS_MAIN), 'default');

                        that.removeListener('mousemove.dragWindow');
                    }
                });
                //如果鼠标在160ms内弹起那么就会取消该事件函数，否则激发拖拽窗口事件
                stopDrag = setTimeout(function () {
                    isDrag = true;

                    view.window.mouseChange($(ID.CANVAS_MAIN), 'move');

                    //-------------激发条件限制 --------------
                    if (context.hoveredNodeId === null) {
                    //--------------------------------------
                        //激活拖动Window事件
                        $(document).trigger('dragWindow');
                    }

                }, 160);
            });
        },

        /**
         * 全屏化窗口
         * @method fullScreen
         * @note code from MDN Lib
         */
        fullScreen : function () {
            if (!document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
                // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        },

        /**
         * 遍历传入的节点数组是否在当前的视窗之中
         * @method findInCurrentWindow
         * @param {Collection} collection 集合类
         */
        findInCurrentWindow : function (collection) {

        },

        /**
         * 删除窗口侦听器
         * @method removeDragWindowEvent
         */
        removeDragWindowEvent : function () {
            this.removeListener('mousedown.dragWindow');
            this.removeListener('dragWindow');
        }
    });

    KT.controller.window = windowController;
    that = KT.controller.window;
}());