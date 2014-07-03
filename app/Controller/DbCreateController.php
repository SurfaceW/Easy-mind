<?php
/**
 * Created by PhpStorm.
 * User: DeLBlunt
 * Date: 13-11-26
 * Time: 下午9:03
 */


 class  DbCreateController extends PDO{
    public $dsn ='mysql:host=localhost;dbname=easy-mind';
    public $username = 'root';
    public $password = 'root';
    public $sql,$sql2,$sql3;
    public $sth;

    public function __construct(){
        try {
            parent::__construct($this->dsn,$this->username,$this->password);
        } catch (PDOException $e) {
            echo 'Something went wrong, and here is the clue: ' . $e->getMessage();
        }
    }
     public function index (){
     $this->sql = "DROP  TABLE IF EXISTS users;
CREATE TABLE users
(
id  INT UNIQUE  auto_increment PRIMARY KEY,
user_mail VARCHAR(60) NOT NULL COMMENT '邮箱',
user_name  VARCHAR(60) NULL COMMENT '用户名',
user_password VARCHAR(40)  NOT NULL COMMENT '密码',
user_key VARCHAR(40)  COMMENT '找回密码',
user_token VARCHAR(50) NOT NULL COMMENT '帐号激活码',
user_token_exptime INT(10) NOT NULL COMMENT '激活码有效期',
user_status tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0-未激活,1-已激活',
user_icon  BLOB COMMENT '头像',
user_registime DATETIME COMMENT '用户的注册时间',
user_logintime DATETIME COMMENT '用户的登录时间'
       )";
         $this->sth = $this->prepare($this->sql);
         $this->sth->execute();


        $this->sql2= "DROP TABLE IF EXISTS trees;
CREATE TABLE  trees
(id INT UNIQUE auto_increment  PRIMARY KEY,
         tree_actual_id INT COMMENT '前端用ID',
         tree_user_id INT COMMENT '图的所有者的ID',
         tree_version VARCHAR(60) COMMENT '图的版本号',
         tree_tags  VARCHAR(1000) COMMENT '图的标签',
         tree_view INT COMMENT '图的视图',
         tree_name VARCHAR(60) COMMENT '图的名字',
         tree_is_public INT COMMENT '图是否公开',
         tree_node_sums INT DEFAULT 0,
         tree_style VARCHAR(60) COMMENT '图的样式',
         tree_dot_x  FLOAT COMMENT '图的主节点横坐标',
         tree_dot_y  FLOAT COMMENT '图的主节点纵坐标',
         tree_create_time datetime COMMENT '图的创建时间',
         tree_edit_time datetime COMMENT '图的编辑时间'
         )";
         $this->sth = $this->prepare($this->sql2);
         $this->sth->execute();



       $this->sql3= "DROP TABLE IF EXISTS nodes;
CREATE TABLE nodes
(
id  INT unsigned auto_increment PRIMARY KEY,
node_actual_id INT,
node_tree_id INT,
node_user_id INT,
node_name VARCHAR(20),
node_note BLOB,
node_level  INT unsigned,
node_view_level INT unsigned,
node_parent_id INT unsigned,
node_child_ids    VARCHAR(1000),
node_dot_x  FLOAT,
node_dot_y  FLOAT,
node_create_time datetime,
node_edit_time datetime,
node_progress INT,
node_importance INT
)";

        $this->sth=$this->prepare($this->sql3);
         $this->sth->execute();
     }
 }


 ?>
