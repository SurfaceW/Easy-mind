/**
 * welcome的View实例
 * - 欢迎视图
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";
    //命名空间转换
    var ID = KT.config.domString.id,
        CLASS = KT.config.domString.classes,

        tool = KT.utils.tool,

        /**
         * Welcome视图
         * + 注意：这个是View的扩展实例
         *
         * @class KT.view.welcome
         * @extends KT.View
         * @module KT.view
         * @uses KT.utils.tool
         * @uses KT.config.domString.id
         * @uses KT.config.domString.classes
         * @since 1.0
         */
        welcomeView = new KT.View();

    /* -------------------- 公有方法 -------------------- */

    tool.defaults(welcomeView,{
        /*

         */
        /**
         * 当前视图
         * <p>
         * 用于表示当前正在显示的属性
         * <li>login : 表示登陆框显示</li>
         * <li>signUp : 表示注册框显示</li>
         * <li>forgot : 表示忘记密码显示</li>
         * </p>
         * @property currentDisplay
         * @type String
         */
        currentDisplay : null

    });
    //login的方法
    tool.extend(welcomeView, {
        /**
         * 控制在welcome三组件中来回跳转
         *
         * @method showLogin
         */
        showLogin : function () {
            this.hide(ID.SIGNUP, 'hide');
            this.hide(ID.FORGOT, 'hide');
            this.setLocation(ID.LOGIN);
            this.show(ID.LOGIN, 'show');
            this.currentDisplay = 'login';
        },

        /**
         * 控制在welcome三组件中来回跳转
         *
         * @method showSignUp
         */
        showSignUp : function () {
            this.hide(ID.LOGIN, 'hide');
            this.hide(ID.FORGOT, 'hide');
            this.setLocation(ID.SIGNUP);
            this.show(ID.SIGNUP, 'show');
            this.currentDisplay = 'signUp';
        },

        /**
         * 控制在welcome三组件中来回跳转
         *
         * @method showForgot
         */
        showForgot : function () {
            this.hide(ID.SIGNUP, 'hide');
            this.hide(ID.LOGIN, 'hide');
            this.setLocation(ID.FORGOT);
            this.show(ID.FORGOT, 'show');
            this.currentDisplay = 'forgot';
        },

        /**
         * 启动介绍功能组件
         *
         * @method learnMore
         */
        learnMore : function () {
            $(ID.WELCOME_MAIN).animate({
                left: parseInt($(ID.WELCOME_MAIN).css('left'), 10) === 0 ? $(ID.WELCOME_INTRO).width() : 0
            });
            $(ID.WELCOME_INTRO).animate({
                left: parseInt($(ID.WELCOME_INTRO).css('left'), 10) === 0 ? -$(ID.WELCOME_INTRO).width() : 0
            });
            var a = parseInt($(ID.WELCOME_MAIN).css('left'), 10);
            console.log(a);
            if (parseInt($(ID.WELCOME_MAIN).css('left'), 10) === 0) {
                $(CLASS.WELCOME_FRAME).animate({
                    marginLeft: 50
                });
            } else {
                $(CLASS.WELCOME_FRAME).animate({
                    marginLeft: $(window).width() / 2 - 185
                });
            }
        },

        /**
         * 当窗口大小修改的时候，修改空间的显示位置
         *
         * @method resize
         */
        resize : function () {
            switch (this.currentDisplay) {
            case 'login':
                this.setLocation(ID.LOGIN);
                break;
            case 'signUp':
                this.setLocation(ID.SIGNUP);
                break;
            case 'forgot':
                this.setLocation(ID.FORGOT);
                break;
            default:
                return;
            }
            this.setLocation(ID.LOGO, '', '40px');
        }
    });

    KT.view.welcome = welcomeView;
}());