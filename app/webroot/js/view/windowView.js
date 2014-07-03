/**
 * @instance windowView
 * @version 1.0
 * @time 2014-05-22 10:52:59
 * @author TEAM_4
 */
(function () {
    "use strict";
    //命名空间转化
    var ID = KT.config.domString.id,
        tool = KT.utils.tool,

        //实例化window
        windowView = new KT.View({});

    //window的方法
    tool.extend(windowView, {
        /**
         * 修改鼠标的样式
         * @method mouseChange
         * @param mouseType
         * @param object 传入的上下文对象
         * @notice 注意绑定的客体上必须清晰明确
         */
        mouseChange : function (object, mouseType) {
            $(object).css({
                cursor : mouseType
            });
        },

        /**
         * 菜单的移动
         * @method toggleMenu
         */
        toggleMenu : function () {
            $(ID.MENU_MAIN).animate({
                marginRight: parseInt($(ID.MENU_MAIN).css('marginRight'), 10) === 0 ?
                    $(ID.MENU_MAIN).width() : 0
            });

        }
    });
    KT.view.window = windowView;
}());