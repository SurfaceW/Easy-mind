/**
 * Module模块加载方法和定义方法，以及实现
 * @version 1.0
 * @time 2014-05-29 19:54:03
 * @author TEAM_4
 */

/**
 * 全局模块存储空间
 * @type {Object}
 */
window.module = window.module || {};

(function (global) {
    "use strict";
    var URL = KT.config.urls;

    /**
     * 定义模块的函数
     * @param {String} id 模块名称
     * @param {Array} dependency 该模块对其他模块的声明依赖
     * @param {*} factory 对象，或者返回对象的匿名工厂函数
     */
    global.define = function (id, dependency, factory) {
        var i, modules = [], obj, clear;

        function getDependency() {
            if (typeof window.module[dependency[i]] === "function") {
                //如果是函数，则执行函数
                obj = (window.module[dependency[i]]());
                if (typeof obj === "object" && obj !== undefined) {
                    modules.push(obj);
                } else {
                    modules.push({});
                }
            } else if (typeof window.module[dependency[i] === "object"]) {
                //如果是对象，则将对象加入模块列表中
                modules.push(window.module[dependency[i]]);
            } else {
                //如果两者都不是，则传入一个空对象
                modules.push({});
            }
        }

        function generateModule() {
            //第二步，设置模块ID
            //第三步，将整个模块，加入到全局模块中
            if (modules.length === 0) {
                //如果没有任何依赖，直接加入模块中
                window.module[id] = factory;
            } else {
                //如果有依赖，则引入依赖，利用高阶函数
                window.module[id] = function () {
                    return factory.apply(window.module, modules);
                };
            }
        }

        if (dependency.length === 0) {
            generateModule();
        }

        //第一步，获取依赖模块
        for (i = 0; i < dependency.length; i += 1) {
            //如果不存在，则使用Ajax的方法，异步加载模块
            if (!window.module[dependency[i]]) {
                $('body').append('<script src="' + URL.moduleLoad + dependency[i] + '.js' + '"></script>');
            }
        }

        //循环检测是否拿到所有的异步模块
        clear = setInterval(function () {
            for (i = 0; i < dependency.length; i += 1) {
                //如果不存在，则使用Ajax的方法，异步加载模块
                if (!window.module[dependency[i]]) {
                    return;
                }
                clearInterval(clear);
                getDependency();
                generateModule();
            }
        }, 200);
    };

    /**
     * 调用模块的函数
     * @param {Array} dependency 依赖模块
     * @param {Function} callback 回调函数，运行的沙箱
     */
    global.require = function (dependency, callback) {
        //第一步，根据Dependency利用Ajax拉取对应需要的描述对应模块的JavaScript文件
        var modules = [],
            obj,
            clear,
            i;

        //第二步，将模块的对象写入modules之中
        function getDependency() {
            if (typeof window.module[dependency[i]] === "function") {
                //如果是函数，则执行函数
                obj = (window.module[dependency[i]]());
                if (typeof obj === "object" && obj !== undefined) {
                    modules.push(obj);
                } else {
                    modules.push({});
                }
            } else if (typeof window.module[dependency[i] === "object"]) {
                //如果是对象，则将对象加入模块列表中
                modules.push(window.module[dependency[i]]);
            } else {
                //如果两者都不是，则传入一个空对象
                modules.push({});
            }
        }

        //第一步，获取依赖模块
        for (i = 0; i < dependency.length; i += 1) {
            //如果不存在，则使用Ajax的方法，异步加载模块
            if (!window.module[dependency[i]]) {
                $('body').append('<script src="' + URL.moduleLoad + dependency[i] + '.js' + '"></script>');
            }
        }

        //循环检测是否拿到所有的异步模块
        clear = setInterval(function () {
            for (i = 0; i < dependency.length; i += 1) {
                //如果不存在，则使用Ajax的方法，异步加载模块
                if (!window.module[dependency[i]]) {
                    return;
                }
                clearInterval(clear);
                getDependency();
                //第三步，将modules分开，以参数的形式，传入callback之中，并调用callback函数
                callback.apply(window.module, modules); //注意：此确定该模块的对应this指针
            }
        }, 200);


    };

//    global.require(['math'], function (math) {
//        math.add(6);
//    });
}(window));