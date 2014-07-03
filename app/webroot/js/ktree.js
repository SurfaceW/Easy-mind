/**
 * 定义全局变量KT，以及它的子模块和对应的命名空间
 *
 *
 * @author TEAM_4
 * @since 1.0
 */

/**
 * 全局模块KT
 *
 * @module KT
 */
var KT = window.KT || {};

/**
 * 用于存储展示的节点数据和缓存已经加载的数据
 *
 * @module KT
 * @submodule collections
 * @type {Array}
 */
KT.collections = [];

// -------------------- Constructor --------------------
KT.Model = null;
KT.Collection = null;
KT.Controller = null;
KT.View = null;
KT.FreeNode = null;


// -------------------- Modules --------------------
/**
 * 模型层模块
 *
 * @module KT
 * @submodule model
 */
KT.model = {};

/**
 * KGraph的集合层模块
 *
 * @module KT
 * @submodule collection
 */
KT.collection = {};

/**
 * KGraph的控制层模块
 *
 * @module KT
 * @submodule controller
 */
KT.controller = {};

/**
 * KGraph的视图层模块
 *
 * @module KT
 * @submodule view
 */
KT.view = {};

/**
 * KGraph的工具库模块
 *
 * @module KT
 * @submodule utils
 */
KT.utils = {};

/**
 * KGraph的配置数据模块
 *
 * @module KT
 * @submodule config
 */
KT.config = {};



