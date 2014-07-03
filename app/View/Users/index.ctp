<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html" charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0">
    <title>知识树 | Knowledge Tree</title>

    <?php
    echo $this->Html->meta('icon');
    echo $this->Html->css(array('public', 'welcome','cgraph','kgraph','kgraph.modal','pagesCtrl','preloader','animation'));
    //'public', 'welcome','cgraph','kgraph','kgraph.modal','pagesCtrl','preloader','animation'
    echo $this->Html->script('/js/jquery-1.11.1.js');
    echo $this->Html->script('/js/ktree.js');

    echo $this->fetch('meta');
    echo $this->fetch('css');
    echo $this->fetch('script');
    ?>

</head>
<body onselectstart="return false">
<!-- 预载界面
 ================== ================== ================== ==================-->
<div class="container" id="loading_container">
    <div id="preload_circle"><span id="preload_loading">Loading...</span></div>
    <div id="team_four"><p class="font_green">TEAM4 2014 | Easy-Mind</p></div>
</div>
<!-- 欢迎界面
 ================== ================== ================== ==================-->
<div class="container" id="welcome_container">
    <!-- logo -->
    <div id="welcome_header">
        <div class="font_green font_center" id="logo"></div>
        <span>将<span class="font_green">知识</span>与<span class="font_green">个人</span>连接在一起</span>
    </div>
    <div id="welcome_body">
        <!-- 简介组件
        ======================================================================-->
        <div id="welcome_intro">
            <div id="intro_arrow"></div>
            <div>
                <p>内容Here</p>
            </div>
        </div>
        <div id="welcome_main">
            <!-- 登录组件
        ======================================================-->
            <div class="border frame" id="login">
                <div class="font_green" id="login_header">
                    <span>欢迎登陆</span>
                </div>
                <hr>
                <div id="login_body">
                    <!--用户名部分-->
                    <div class="email border_tight" id="login_email">
                        <span class="input_img_add input_img_email"></span>
                        <input type="email" id="login_input_email" required autofocus autocomplete
                               placeholder="邮箱" tabindex="1"/>
                        <span id="remember"></span>
                    </div>
                    <!--密码部分-->
                    <div class="password border_tight" id="login_password">
                        <span class="input_img_add input_img_password"></span>
                        <input type="password" id="login_input_password" required placeholder="密码" autocomplete="on" tabindex="2"/>
                    </div>
                    <!--登录按钮-->
                    <div class="input_group">
                        <input class="input_submit" id="login_button" type="button" value="">
                    </div>
                </div>

                <!--注册及忘记密码链接-->
                <div class="font_12 font_green font_center" id="login_footer">
                    <a id="forgot_password">忘记密码</a> 或 <a id="jump_signUp">注册新用户？</a>
                    <span class="input_help" id="login_help">密码由6~18位数字字母及下划线组成</span>
                </div>
            </div>

            <!-- 注册组件
            ======================================================-->
            <div class="border frame" id="signUp">
                <div class="font_green" id="signUp_header">
                    <span>注册Easy-Mind</span>
                </div>
                <hr>
                <div id="signUp_body">
                    <!--用户名部分-->
                    <div class="email border_tight" id="signUp_email">
                        <span class="input_img_add input_img_email"></span>
                        <input type="email" id="signUp_input_email" placeholder="邮箱将作为登录的用户名"/>
                    </div>

                    <!--密码部分-->
                    <div class="password border_tight" id="signUp_password">
                        <span class="input_img_add input_img_password"></span>
                        <input type="password" id="signUp_input_password" placeholder="密码为6~18个字符"/>
                    </div>

                    <!--注册按钮-->
                    <div id="signUp_button">

                    </div>
                </div>
                <div id="signUp_footer">
                    <a class="jump_login">已有账号？</a>
                    <span class="input_help" id="signUp_help"></span>
                </div>
            </div>

            <!-- 忘记密码组件
            ======================================================-->
            <div class="border frame" id="forgot">
                <div class="font_green" id="forgot_header">
                    <span>找回密码</span>
                </div>
                <hr>
                <div id="forgot_body">
                    <div class="jump_login"></div>
                    <!--邮箱部分-->
                    <div class="email border_tight" id="forgot_email">
                        <span class="input_img_add input_img_email" id="forgot_email_img"></span>
                        <input class="inputText" type="email" id="forgot_input_email" placeholder="您注册时所用的邮箱"/>
                    </div>
                    <!--发送按钮-->
                    <div id="forgot_send"></div>
                </div>
                <div id="forgot_footer">
                    <a class="jump_login">返回登录</a>
                    <span class="input_help" id="forgot_help"></span>
                </div>
            </div>
        </div>
    </div>
    <div id="welcome_footer">
        <div id="learn_more">
        </div>
        <div>
            <a>TEAM4 2014 | Easy-Mind</a>
        </div>
    </div>
</div>

<!-- 选择图界面
 ================== ================== ================== ==================-->
<div class="container" id="cgraph_container">
    <div class="modal modal_middle border" id="cgraph_modal">
        <div class="modal_header" onselectstart="return false">
            <span>主图属性</span>
            <div class="modal_close" id="cgraph_modal_close"></div>
        </div>
        <hr/>
        <div class="modal_body">
            <div id="cgraph_name_group">
                <label>名字</label>
                <input id="cgraph_name" type="text" placeholder="新的知识图谱"/><br/>
            </div>
            <!--
            <div id="cgraph_tag_group">
                <label>标签</label>
                <ul id="cgraph_tag" contenteditable="true">
                    <li>I like it</li>
                    <li id="add_cgraph_tag"><span>+</span></li>
                </ul>
            </div>
            -->
            <div>
                <input class="button_success button_middle font_green" type="button" id="save_cgraph" value="保存"/>
            </div>
            <div>
                <input class="button_warning button_middle font_green" type="button" id="delete_cgraph" value="删除该图"/>
            </div>
        </div>
    </div>
</div>

<!-- 自由图界面
 ================== ================== ================== ==================-->
<div class="container" id="kgraph_container">
    <!-- 按钮交互层 -->
    <div id="icon_layer">
        <div class="icon focus fix menu_hover" id="icon_menu"></div>
        <div class="icon focus fix" id="icon_back"></div>
        <div class="icon focus fix" id="icon_zoom_in"></div>
        <div class="icon focus fix" id="icon_zoom_out"></div>
        <div class="icon focus fix" id="icon_add_new"></div>
    </div>
    <!-- 菜单层 -->
    <div class="fix menu_hover" id="menu_main">
        <ul class="ul font_white font_14">
            <li id="menu_user">
                <span class="icon menu_icon" id="icon_user"></span>
                <span class="menu_word">用户信息</span>
            </li>
            <li id="menu_save">
                <span class="icon menu_icon" id="icon_save"></span>
                <span class="menu_word">保存</span>
            </li>
            <li id="menu_logout">
                <span class="icon menu_icon" id="icon_logout"></span>
                <span class="menu_word">登出</span>
            </li>
        </ul>
    </div>
    <!-- 搜索框
     ======================================================-->
    <div class="fix border_tight" id="search">
        <div id="searchImg"></div>
        <input id="searchText" type="search" autofocus="autofocus" placeholder="Search"/>
    </div>
    <!-- 模态框
     ======================================================-->
    <div id="modal_layer">
        <!-- FreeGraph 属性框 -->
        <div class="modal modal_middle fix border" id="modal_node">
            <div class="modal_header font_green" onselectstart="return false">
                <span>节点属性</span>
                <span class="modal_close" id="node_modal_close"></span>
            </div>
            <hr/>
            <div class="modal_body">
                <div class="node_group">
                    <input id="node_name" type="text" placeholder="节点名称"/>
                </div>
                <div class="node_group">
                    <p class="font_green font_14 font_left">知识重要程度</p>
                    <input id="node_importance" type="range" placeholder="%" value=""/>
                    <span class="font_right" id="value_importance"></span>
                </div>
                <div class="node_group">
                    <p class="font_green font_14 font_left">知识学习进度</p>
                    <input id="node_progress" type="range" placeholder="%">
                    <span class="font_right" id="value_progress"></span>
                </div>
                <div class="node_group">
                    <button class="button_middle block" id="edit_node_note" type="button" value="编辑学习笔记">编辑学习笔记</button>
                </div>
            </div>
        </div>

        <!-- 账户信息框 -->
        <div class="modal modal_large border" id="modal_user">
            <div class="modal_header" onselectstart="return false">
                <span>账户设置</span>
                <span class="modal_close" id="user_modal_close"></span>
            </div>
            <div class="modal_body">
                <nav>
                    <ul>
                        <li>个人资料</li>
                        <li>账号安全</li>
                        <li>通知设置</li>
                    </ul>
                </nav>
                <div class="modal_content">
                    <div class="modal_user_section" id="modal_user_section_1">
                        <div id="modal_user_icon"></div>
                        <div id="modal_user_name">
                            <p>叶青楠</p>
                        </div>
                        <div id="modal_user_url">
                            <p>www.yeqingnan.com</p>
                        </div>
                        <div id="modal_user_email">
                            <p>yeqingnan@live.cn</p>
                        </div>
                        <input type="button" class="button button_large" id="modal_user_checkmore" value="查看更多"/>
                    </div>
                    <div class="modal_user_section" id="modal_user_section_2"></div>
                    <div class="modal_user_section" id="modal_user_section_3"></div>

                </div>
            </div>
        </div>

        <div class="modal" id="modal_theme"></div>
        <div class="modal" id="modal_view"></div>
        <div class="modal" id="modal_share"></div>
        <div class="modal" id="modal_export"></div>
    </div>
    <!-- 绘制层 -->
    <div id="canvas_whole" style="display: none">
        <canvas id="canvas_graph"></canvas>
    </div>
</div>





<!-- icon界面
 ================== ================== ================== ==================
<div class="container" id="icon_container">
</div>-->

<?php
/*!
echo $this->Html->script('/dist/KnowledgeTree.js');
*/

echo $this->Html->script('/js/config/config.js');
echo $this->Html->script('/js/config/nodeArgs.js');
echo $this->Html->script('/js/config/domString.js');
echo $this->Html->script('/js/config/urls.js');

echo $this->Html->script('/js/utils/tool.js');
echo $this->Html->script('/js/utils/browser.js');
echo $this->Html->script('/js/utils/math.js');

echo $this->Html->script('/js/model/model.js');
echo $this->Html->script('/js/model/userModel.js');
echo $this->Html->script('/js/model/windowModel.js');

echo $this->Html->script('/js/collection/collection.js');
echo $this->Html->script('/js/collection/cgraphCollection.js');
echo $this->Html->script('/js/collection/freeNodeCollection.js');

echo $this->Html->script('/js/view/view.js');
echo $this->Html->script('/js/view/cgraphView.js');
echo $this->Html->script('/js/view/windowView.js');
echo $this->Html->script('/js/view/canvasView.js');
echo $this->Html->script('/js/view/welcomeView.js');
echo $this->Html->script('/js/view/freeGraphView.js');


echo $this->Html->script('/js/controller/controller.js');
echo $this->Html->script('/js/controller/cgraphController.js');
echo $this->Html->script('/js/controller/windowController.js');
echo $this->Html->script('/js/controller/welcomeController.js');
echo $this->Html->script('/js/controller/freeGraphController.js');
echo $this->Html->script('/js/controller/iniController.js');

echo $this->Html->script('/js/module/module.js');

?>

</body>
</html>

