/**
 * FreeNodeCollection 构造器
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    var tool = KT.utils.tool,
        Dot = KT.utils.math.Dot,

        nodeArgs = KT.config.nodeArgs,

        freeNodeGraphCollection;


    /**
     * FreeNodeCollection构造器
     *
     * @class KT.FreeNode
     * @constructor
     * @module KT
     * @uses KT.utils.tool
     * @uses KT.utils.math
     * @uses KT.config
     * @since 1.0
     */
        KT.FreeNode = freeNodeGraphCollection = function () {
            /**
             * 保存基本数据
             *
             * @property models 集合类的基本数据
             * @type Array
             */
            this.models = [];

            /**
             * 用户自由视图id
             *
             * @property id
             * @type Number
             */
            this.id = null;
            //全局主节点的最大ID
            /**
             * 全局节点的最大Id
             *
             * @property maxId
             * @type Number
             */
            this.maxId = null;
            //表示是否被初始化赋值
            /**
             * 表示是否被初始化赋值
             *
             * @property isIni
             * @type Boolean
             */
            this.isIni = false;
            /**
             * 新建的fNode的集合
             * - 注意：里面保存的是节点id，不是对象的clone
             *
             * @property createdNodeId
             * @type Array
             */
            this.createdFNodeId = [];
            /**
             * 删除的fNode的集合
             * - 注意：里面保存的是节点id，不是对象的clone
             *
             * @property deletedNodeId
             * @type Array
             */
            this.deletedFNodeId = [];

            this.constructor = KT.Collection;
        };

    //原型链继承于Collection
    tool.extend(freeNodeGraphCollection.prototype, KT.Collection.prototype);

    //自由图集合属性
    tool.defaults(freeNodeGraphCollection.prototype, {
        /**
         * 表示该集合存放的是FreeNodeCollection中的节点
         *
         * @property type
         * @type String
         */
        type : 'freeNode'
    });
    //自由图集合方法
    tool.extend(freeNodeGraphCollection.prototype, {
        /**
         * 创建一个新的子节点
         *
         * @method createFreeNode
         * @returns {*}
         */
        createFreeNode : function (parentNode, x, y) {
            this.findMaxFreeNodeId();
            var nLevel = parentNode.level + 1,
                newNode = new KT.Model({ //新建的节点模板
                    //基本属性
                    id: this.maxId + 1,
                    level: nLevel,
                    parentId: parentNode.id,
                    childId: [],
                    center: (new Dot(x, y)),

                    //用户属性
                    name: "新的知识",
                    importance: 40,
                    progress: 50,
                    note: null,
                    radius: nodeArgs.FREE_GRAPH.RADIUS['level' +
                        (nLevel >= 4 ? 4 : nLevel)]
                });
            parentNode.childId.push(newNode.id);
            this.models.push(newNode);
            return this.getModel('id', newNode.id);
        },

        /**
         * 删除或拖动图的某个整枝
         * - 包括父节点本身
         *
         * @method findAllChild
         * @param {Object} callNode Node对象
         */
        findAllChild: function (callNode) {
            var that = this,
                tempId = [];
            function recursive(node) {
                var j,
                    nodeChild;
                if (node.childId.length > 0) {
                    for (j = 0; j < node.childId.length; j += 1) {
                        nodeChild = node.childId;
                        recursive(that.getNode( Number(nodeChild[j]) ));
                    }
                }
                tempId.push(node.id);
            }
            recursive(callNode);
            //递归开始
            return tempId;
        },

        /**
         * 求取节点的最大深度
         *
         * @method findDepth
         * @returns {number}
         */
        findDepth : function () {
            var maxDepth = 1,
                i;
            for (i = 0; i < this.models.length; i += 1) {
                if (this.models[i].level >= maxDepth) {
                    maxDepth = this.models[i].level;
                }
            }
            return maxDepth;
        },

        /**
         * 求取给定节点深度的ID集合
         *
         * @param {number} level
         * @returns {Array}
         */
        findLevelNodes : function (level) {
            var array = [],
                i;
            for (i = 0; i < this.models.length; i += 1) {
                if (this.models[i].level === level) {
                    array.push(this.models[i].id);
                }
            }
            return array;
        },

        /**
         * 获取最大的主要节点ID
         *
         * @method findMaxFreeNodeId
         */
        findMaxFreeNodeId: function () {
            var maxId = 0,
                i;
            if (this.models.length === 0) {
                maxId = null;
            }
            for (i = 0; i < this.models.length; i += 1) {
                if (this.models[i].id >= maxId) {
                    maxId = this.models[i].id;
                }
            }
            this.maxId = maxId;
        },

        /**
         * 公有方法：给定id，返回相应的节点对象
         *
         * @method getNode
         * @param {Number} id
         * @returns {*}
         */
        getNode: function (id) {
            return this.getModel('id', id);
        },

        /**
         * 获得父节点Model对象
         *
         * @method getParentNode
         * @param {Object} node
         * @returns {Model}
         */
        getParentNode : function (node) {
            return this.getNode(node.parentId);
        },

        /**
         * 产生对应的节点集合的动作序列
         *
         * @returns {*}
         */
        generateActionSequence : function () {
            var sequence = [],
                i,
                max,
                item;

            for (i = 0, max = this.createdFNodeId.length; i < max; i += 1) {
                item = this.getModel('id', this.createdFNodeId[i]);
                sequence.push({
                    action : 'add',
                    tree_actual_id : this.id,
                    node_actual_id : item.id,
                    node_parent_id : item.parentId,
                    node_name : item.name,
                    node_importance : item.importance,
                    node_progress : item.progress,
                    node_note : item.note,
                    node_dot_x : item.center.x,
                    node_dot_y : item.center.y,
                    node_level : item.level,
                    node_view_level : 1
                });
            }
            for (i = 0, max = this.models.length; i < max; i += 1) {
                item = this.models[i];
                if (item.change === true) {
                    sequence.push({
                        action : 'edit',
                        tree_actual_id : this.id,
                        node_actual_id : item.id,
                        node_parent_id : item.parentId,
                        node_name : item.name,
                        node_importance : item.importance,
                        node_progress : item.progress,
                        node_note : item.note,
                        node_dot_x : item.center.x,
                        node_dot_y : item.center.y,
                        node_level : item.level,
                        node_child_ids : item.childId,
                        node_view_level : 1
                    });
                    //提交改变之后，复原改变
                    item.change = false;
                }
            }
            for (i = 0, max = this.deletedFNodeId.length; i < max; i += 1) {
                sequence.push({
                    action: 'delete',
                    tree_actual_id : this.id,
                    node_actual_id : this.deletedFNodeId[i]
                });
            }

            this.deletedFNodeId = [];
            this.createdFNodeId = [];
            return {data : sequence};
        }
    });
}());