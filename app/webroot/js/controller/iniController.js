/**
 * @instance iniController
 * @version 1.0
 * @time 2014-05-22 11:09:05
 * @author TEAM_4
 */
(function () {
    "use strict";
    var tool = KT.utils.tool,

        view = KT.view,
        controller = KT.controller,

        iniController = new KT.Controller();

    tool.extend(iniController, {
        /**
         * 当文档加载事件完毕之后，调用ini的方法初
         * @method iniStart
         * 始化Canvas配置 || 初始化model中window的基本参数
         */
        iniStart: function () {
            controller.window.iniWindowController();
            view.canvas.iniCanvasHandler();
        }
    });
    KT.controller.iniStart = iniController;
}());


(function () {
    "use strict";
    var controller = KT.controller,
        ID = KT.config.domString.id;

    //当文档渲染完毕后
    $(document).ready(function () {
        controller.iniStart.iniStart();
    });

    //当资源加载完毕后
    window.onload = function () {
        controller.window.fullScreen();
        //进行localStorage的检查
        if (localStorage.getItem('userMail') !== null && localStorage.getItem('userPassword') !== null) {
            //如果有值则进行登录
            controller.welcome.login({
                user_mail : window.localStorage.getItem('userMail'),
                password : window.localStorage.getItem('userPassword')
            });
        } else {
            //载入登录模块
            controller.welcome.iniWelcome();
        }
        //PreLoad界面消失
        $(ID.PRE_LOADER).fadeOut('fast');
        $(ID.WELCOME).fadeIn('fast');
    };

}());