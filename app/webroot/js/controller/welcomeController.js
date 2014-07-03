/**
 * @instance welcomeController
 * @version 1.0
 * @time 2014-05-23 11:19:45
 * @author TEAM_4
 */
(function () {
    "use strict";
    //命名空间转换
    var ID = KT.config.domString.id,
        CLASS = KT.config.domString.classes,
        URLS = KT.config.urls,

        tool = KT.utils.tool,

        model = KT.model,
        view = KT.view,
        controller = KT.controller,

        that,

        //实例化welcome控制器
        welcomeController = new KT.Controller();
    /**
     * 绑定登录组件基本事件
     * @method iniListener
     * @private
     */
    function iniListener() {
        var loginFunc = function () {
            var data = {
                user_mail: $(ID.LOGIN_USERNAME).val(),
                password: $(ID.LOGIN_PASSWORD).val()
                };
                controller.welcome.login(data);
            },
            signUpFunc = function () {
                var data = {
                    user_mail: $(ID.SIGNUP_USERNAME).val(),
                    password: $(ID.SIGNUP_PASSWORD).val()
                };
                controller.welcome.signUp(data);
            },
            forgetPassFunc = function () {
                var data = {
                    user_mail : $(ID.FORGOT_EMAIL).val()
                };
                controller.welcome.forgotPassword(data);
            };

        that.addListener(ID.LOGIN_BUTTON, 'click.loginButton', function () {
            loginFunc();
        });

        //侦听回车事件
        that.addListener(ID.LOGIN_PASSWORD, 'keypress.loginButton', function (e) {
            if (e.keyCode !== 13) {return;}
            loginFunc();
        });
        that.addListener(ID.SIGNUP_BUTTON, 'click.signUpButton', function () {
            signUpFunc();
        });
        that.addListener(ID.SIGNUP_BUTTON, 'keypress.signUpButton', function (e) {
            if (e.keyCode !== 13) {return;}
            signUpFunc();
        });
        that.addListener(ID.FORGOT_SEND, 'click.forgotPassword', function () {
            forgetPassFunc();
        });
        that.addListener(ID.JUMP_SIGNUP, 'click.jumpToSignUp', function () {
            view.welcome.showSignUp();
            $(ID.SIGNUP).addClass(CLASS.ANIMATION_SWING);
            setTimeout(function () {
                $(ID.SIGNUP).removeClass(CLASS.ANIMATION_SWING);
            }, 1000);
        });
        that.addListener(ID.FORGET_PASSWORD, 'click.forgotPassword', function () {
            view.welcome.showForgot();
            $(ID.FORGOT).addClass(CLASS.ANIMATION_SWING);
            setTimeout(function () {
                $(ID.FORGET_PASSWORD).removeClass(CLASS.ANIMATION_SWING);
            }, 1000);
        });
        that.addListener(CLASS.JUMP_LOGIN, 'click.jumpToLogin', function () {
            view.welcome.showLogin();
            $(ID.LOGIN).addClass(CLASS.ANIMATION_SWING);
            setTimeout(function () {
                $(ID.LOGIN).removeClass(CLASS.ANIMATION_SWING);
            }, 1000);
        });
        that.addListener(ID.LEARN_MORE, 'click.learnMore', function () {
            //view.welcome.learnMore();
        });
    }

    /* -------------------- 公有方法 -------------------- */

    tool.extend(welcomeController, {
        /**
         * 初始化欢迎界面
         * @method ini
         */
        iniWelcome: function () {
            $(ID.WELCOME).fadeIn('slow');
            //设置全局Window的视图
            controller.window.currentView = 'welcome';
            iniListener();
        },

        /**
         * 忘记密码的请求设置
         * @method forgotPassword
         */
        forgotPassword : function (data) {
            model.user.ajaxSend(URLS.forgot, data, function (response) {
                switch (response) {
                    case 0:
                        //alert('该邮箱尚未注册');
                        break;
                    case 1:
                        //alert('相关的修改密码的邮件已经发送');
                        //success
                        view.welcome.showLogin();
                        break;
                    default:
                        return;
                }
            }, function () {
                //error
            });
        },

        /**
         * 用户登录的时候，所需要进行的数据交换
         * @method login
         */
        login: function (data) {
            model.user.ajaxSend(URLS.login, data, function (response) {
                //success
                switch (response[0]) {
                    case 0:
                        $(ID.LOGIN_HELP).show().text('用户未注册');
                        //alert('用户未注册');
                        break;
                    case 1:
                        $(ID.LOGIN_HELP).show().text('请登录您注册的邮箱，激活账号');
                        //alert('请登录您注册的邮箱，激活账号');
                        break;
                    case 2:
                        $(ID.LOGIN_HELP).show().text('账号或密码不正确');
                        $(ID.LOGIN).addClass(CLASS.ANIMATION_SHAKE);
                        setTimeout(function () {
                            $(ID.LOGIN).removeClass(CLASS.ANIMATION_SHAKE);
                        }, 1000);
                        //alert('账号或密码不正确');
                        break;
                    //登录成功之后，获得调用函数，获得用户信息
                    case 3:
                        model.user.setUserData(response[1]);
                        //设置LocalStorage存储
                        window.localStorage.setItem('userMail', data.user_mail);
                        window.localStorage.setItem('userPassword', data.password);
                        //编辑模式
                        controller.cGraph.iniCGraph(response[2]);
                        controller.welcome.toCGraph();
                        break;
                    default:
                }
            }, function () {
                //error
            });
        },

        /**
         * 用户注册的时候，所需要进行的数据交换
         * @method signUp
         */
        signUp: function (data) {
            model.user.ajaxSend(URLS.signUp, data, function (response) {
                switch (response) {
                    case 0:
                        alert('邮箱已被注册');
                        break;
                    case 1:
                        //alert('验证邮件已发送，请查收!');
                        view.welcome.showLogin();
                        break;
                    default:
                }
            }, function (response) {
                //error
            });
        },

        /**
         * 跳转到CGraph视图
         * @method toCgraph
         */
        toCGraph: function () {
            //欣赏模式
            //controller.cGraph.iniVisitCGraph();
            view.welcome.hide(ID.WELCOME, 'fadeOut', 100);
            view.welcome.show(ID.MENU_MAIN);
            view.welcome.show(ID.ICON_LAYER);
            this.emptyListener();
        }
    });

    KT.controller.welcome = welcomeController;
    that = KT.controller.welcome;
}());