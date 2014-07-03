/**
 *
 */
(function () {
    "use strict";
    var tool = KT.utils.tool,
        math = KT.utils.math,

        model = KT.model,


        cGraphCollection = new KT.Collection();

    //自由图集合属性
    tool.defaults(cGraphCollection, {
        maxId : null,
        isIni : false,
        //创建的cGraph Nodes ID的集合
        createdNodeId : [],
        //创建的fGraph Nodes ID的集合
        deletedNodeId : []
    });

    //自由图集合方法
    tool.extend(cGraphCollection, {
        /**
         * 获取最大的主要节点ID
         */
        findMaxMainNodeId: function () {
            //----------- 条件判定 -----------
            if (this.models.length === 0) {
                this.maxId = 0;
            }
            var maxId = 0,
                i,
                max;
            for (i = 0, max = this.models.length; i < max; i += 1) {
                if (this.models[i].id > maxId) {
                    maxId = this.models[i].id;
                }
            }
            this.maxId = maxId;
        },

        /**
         * 创建一个新的主节点
         * @param {Number} x
         * @param {Number} y
         * @returns {Object}
         */
        createNewMainNode : function (x, y) {
            this.findMaxMainNodeId();
            //新的节点的模板
            var newNode = {
                id : this.maxId + 1,
                name : '新的知识',
                tag : '',
                center : model.window.getCanvasLocation(math.Dot(x, y)),
                childNumber : 0,
                alpha: 0.35
            };
            this.models.push(newNode);
            return this.getModel('id', newNode.id);
        },

        /**
         * 生成该集合的动作序列
         * @method generateActionSequence
         * @returns {Object}
         */
        generateActionSequence : function () {
            var wc = KT.controller.window,
                zoom = wc.ZOOM_POOL[wc.zoomLevel],
                sequence = [],
                item,
                i;
            for (i = 0; i < this.createdNodeId.length; i += 1) {
                item = this.getModel('id', this.createdNodeId[i]);
                sequence.push({
                    action : 'add',
                    tree_actual_id : item.id,
                    tree_name : item.name,
                    tree_dot_x : item.center.x / zoom,
                    tree_dot_y : item.center.y / zoom,
                    tree_tags : [],
                    tree_version : "2.0",
                    tree_view : 1,
                    tree_is_public : 1,
                    tree_style : 1
                });
            }
            for (i = 0; i < this.models.length; i += 1) {
                item = this.models[i];
                if (item.change === true) {
                    sequence.push({
                        action : 'edit',
                        tree_actual_id : item.id,
                        tree_name : item.name,
                        tree_dot_x : item.center.x / zoom,
                        tree_dot_y : item.center.y / zoom,
                        tree_tags : [],
                        tree_version : '2.0',
                        tree_view : 1,
                        tree_is_public : 1,
                        tree_style : 1
                    });
                    //提交改变之后，复原改变
                    item.change = false;
                }
            }
            for (i = 0; i < this.deletedNodeId.length; i += 1) {
                sequence.push({
                    action: 'delete',
                    tree_actual_id: this.deletedNodeId[i]
                });
            }
            this.deletedNodeId = [];
            this.createdNodeId = [];
            return {data : sequence};
        }
    });
    KT.collection.cGraph = cGraphCollection;
}());