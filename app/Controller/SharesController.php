<?php
/**
 * Created by PhpStorm.
 * User: Gregary
 * Date: 14-3-26
 * Time: 下午3:19
 */

class SharesController extends AppController{


    var $uses = array('User','Node','Tree');


    public $helpers = array('Session');
    public $components = array('Session');


    function index(){}


    function view($user_name,$tree_id = null){


        if($tree_id != null){
            /*
           * to catch all the data
           */
            $node_tree_id = $tree_id;
            $temp = $this->User->find('first',array('conditions' => array('user_name' => $user_name)));
            $node_user_id = $temp['User']['id'];
            //$node_tree_id = $_POST['tree_actual_id'];
            //$node_user_id = $this->Session->read('magic_id');
            //$node_user_id = 2;


            /*
               * to find all the data
               */

            $result_temp = $this->Node->find('all',array('conditions' => array('node_tree_id' => $node_tree_id,'node_user_id' => $node_user_id)));

            foreach($result_temp as $fur)
                $result[] = $fur['Node'];

            /*
              * to return the result
            */
            $this->set('result',$result);

        }else{
            /*
         * to catch all the data
         */

            $temp = $this->User->find('first',array('conditions' => array('user_name' => $user_name)));
            $tree_user_id = $temp['User']['id'];

            /*
                * to delete all the data
                */
            $result_temp = $this->Tree->find('all',array('conditions' => array('tree_user_id' => $tree_user_id)));

            foreach($result_temp as $fur)
                $result[] = $fur['Tree'];

            /*
              * to return the result
              */

            $this->set('result',$result);

        }


    }





} 