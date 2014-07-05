/**
 * DOM的属性名称映射
 * - DOM之中的标签上的ID以及CLASS的字符串集合
 *
 * @since 1.0
 * @author TEAM-4
 */


/**
 * Config 程序参数配置对象
 *
 * @class KT.config.domString
 * @module KT.config
 * @since 1.0
 */
KT.config.domString = {
    //@todo 由于没有最终确定，所以里面的值暂时不注释，以免无用功
    id: {
        /* --------- 登录登出属性类 --------- */
        LOGIN: '#login',
        LOGIN_BUTTON: '#login_button',
        LOGIN_USERNAME: '#login_input_email',
        LOGIN_PASSWORD: '#login_input_password',
        JUMP_SIGNUP : '#jump_signUp',
        FORGET_PASSWORD: '#forgot_password',
        LOGIN_HELP: '#login_help',

        /*----------注册类---------*/
        SIGNUP: '#signUp',
        SIGNUP_BUTTON: '#signUp_button',
        SIGNUP_USERNAME: '#signUp_input_email',
        SIGNUP_PASSWORD: '#signUp_input_password',
        SIGNUP_HELP: '#signUp_help',

        /*-----------忘记密码类-----------*/
        FORGOT: '#forgot',
        FORGOT_SEND: '#forgot_send',
        FORGOT_EMAIL : '#forgot_input_email',
        FORGOT_HELP: '#forgot_help',

        /* --------- 预载入类 --------- */
        //预载入框
        PRE_LOADER: '#loading_container',

        /* --------- 按钮类 --------- */
        LOGO: '#logo',
        ICON_LAYER: '#icon_layer',
        ICON_MENU: '#icon_menu',
        //放大和缩小按钮
        ICON_MINUS: '#icon_zoom_out',
        ICON_PLUS: '#icon_zoom_in',
        ICON_FULL_SCREEN: '#icon_full_screen',
        //主菜单
        MENU_MAIN: '#menu_main',
        MENU_SAVE: '#menu_save',
        MENU_UNDO: '#menu_undo',
        MENU_LOGOUT: '#menu_logout',
        ICON_USER: '#menu_user',
        //返回主视图的按钮
        ICON_BACK : '#icon_back',

        /* --------- WELCOME界面 --------- */
        WELCOME: '#welcome_container',
        LEARN_MORE: '#learn_more',
        WELCOME_INTRO: '#welcome_intro',
        WELCOME_MAIN: '#welcome_main',
        WELCOME_BODY: '#welcome_body',


        /* --------- Canvas类 --------- */
        //全局Canvas
        CANVAS_WHOLE: '#canvas_whole',
        //主程序的Canvas画布
        CANVAS_MAIN: '#canvas_graph',

        /* --------- Modal类 --------- */
        //节点属性模态框
        MODAL_NODE: '#modal_node',
        MODAL_USER: '#modal_user',
        MODAL_THEME: '#modal_theme',
        MODAL_EXPORT: '#modal_export',
        MODAL_VIEW: '#modal_view',
        MODAL_SHARE: '#modal_share',
        MODAL_SEARCH: '#search',

        /* --------- 自由图的属性编辑 --------- */
        FREENODE_NAME : '#node_name',
        FREENODE_IMPORTANCE : '#node_importance',
        FREENODE_PROGRESS : '#node_progress',
        FREENODE_NOTE : '#edit_node_note',
        FREENODE_CLOSE: '#node_modal_close',

        /* ---------- 选择Main Node --------- */
        CGRAPH : '#cgraph_container',
        CGRAPH_ADD_BUTTON: '#icon_add_new',

        CGRAPH_MODAL : '#cgraph_modal',
        CGRAPH_SAVE: '#save_cgraph',
        CGRAPH_DELETE: '#delete_cgraph',
        CGRAPH_NAME: '#cgraph_name',
        CGRAPH_TAG: '#cgraph_tag',
        CGRAPH_CLOSE: '#cgraph_modal_close',

        /* ---------- User Modal 模态框 --------- */

        USER_CLOSE: '#user_modal_close'

        /* ---------- Theme Modal 模态框 --------- */
        /* ---------- View Modal 模态框 --------- */
        /* ---------- Share Modal 模态框 --------- */
        /* ---------- Export Modal 模态框 --------- */
    },
    classes: {
        JUMP_LOGIN: '.jump_login',
        MODAL_ALL: '.modal',
        MODAL_ALL_HEADER: '.modal_header',
        MODAL_CLOSE: '.modal_close',
        ICON_MENU_LIGHT: 'icon_menu_light',//watch Out!,
        WELCOME_FRAME: '.frame',

        ANIMATION_SWING : 'animation_swing', //X轴晃动的动画效果
        ANIMATION_SHAKE: 'animation_shake', //出错时摇摆的效果
        ANIMATION_SLIDE_IN: 'animation_slideInLeft',
        ANIMATION_SLIDE_OUT: 'animation_slideOutLeft'
    }
};