<?php
/**
 * Created by PhpStorm.
 * User: Alan
 * Date: 14-3-12
 * Time: 下午11:05
 */

class TreesController extends AppController{

    var $name = 'Trees';
    var $uses = array('Tree','Node');


    public $helpers = array('Session');
    public $components = array('Session');


    function index(){}

    function update(){
        if($this->request->is('post') && $this->Session->read('magic_id') != null){

            $result = json_decode(file_get_contents('php://input'));

            if($result->data != NULL){
                foreach($result->data as $singleData){
                    if($singleData != null){
                        if($singleData->action == 'add')
                            $this->_add($singleData);
                        if($singleData->action == 'delete')
                            $this->_delete($singleData);
                        if($singleData->action == 'edit')
                            $this->_edit($singleData);
                    }
                }
            }

            $result = 1;

            $this->set('result',$result);
        }
    }


    /*
     * function viewAll() : to view all trees of a user
     *
     * ro return all the tree data of a user
     */
    function viewAll(){
        /*
         * to catch all the data
         */
        if($this->Session->read('magic_id') != null){

            $tree_user_id = $this->Session->read('magic_id');

            /*
                * to delete all the data
                */
            $result_temp = $this->Tree->find('all',array('conditions' => array('tree_user_id' => $tree_user_id)));

            if($result_temp != null){
                foreach($result_temp as $fur)
                    $result[] = $fur['Tree'];
            }else
                $result = null;

            /*
              * to return the result
              */
            $this->set('result',$result);
        }else
            $this->redirect(array('controller' => 'Users', 'action' => 'index'));

    }
    //test ok


    /*
      * function add() : to add tree
      * case 0 : add failed
      * case 1 : add succeed!
      *
      */
    function _add($singleData){

        
            /*
             * to catch all the data
             */
            $this->request->data['tree_actual_id'] = $singleData->tree_actual_id;
            //var_dump($this->request->data['tree_actual_id']);
            $this->request->data['tree_user_id'] =  $this->Session->read('magic_id');
            //$this->request->data['tree_user_id'] = 2;
            $this->request->data['id'] = null;
            //var_dump($this->request->data['tree_user_id']);
            $this->request->data['tree_version'] = $singleData->tree_version;
            //var_dump( $this->request->data['tree_versions'] );
            $this->request->data['tree_tags'] = implode(" ",$singleData->tree_tags);
            //var_dump($this->request->data['tree_tags']);
            $this->request->data['tree_view'] = $singleData->tree_view;
            //var_dump($this->request->data['tree_views'] );
            $this->request->data['tree_name'] = $singleData->tree_name;
            //$this->request->data['tree_node_sums'] = 0;
            //var_dump($this->request->data['tree_node_sums'] );
            $this->request->data['tree_is_public'] = $singleData->tree_is_public;
            $this->request->data['tree_node_sums'] = 0 ;
            //var_dump($this->request->data['tree_is_public']);
            $this->request->data['tree_style']  = $singleData->tree_style;  $this->request->data['tree_name'] = $singleData->tree_name;

            //var_dump($this->request->data['tree_styles'] );
            $this->request->data['tree_dot_x'] = $singleData->tree_dot_x;
            $this->request->data['tree_dot_y'] = $singleData->tree_dot_y;
            $this->request->data['tree_create_time'] = gmdate("Y-m-d H:i:s", time() + 8 * 3600);


            /*
             * to save all the data
             */
            $this->Tree->save($this->request->data);

    }
    //test ok


    /*
      * function delete() : to delete tree
      * case 0 : delete failed
      * case 1 : delete succeed!
      *
      */
    function _delete($singleData){

          /*
           * to catch all the data
           */

            $tree_actual_id = $singleData->tree_actual_id;
            $tree_user_id = $this->Session->read('magic_id');


            /*
             * to delete all the data
             */
            $temp_tree_data = $this->Tree->find('first',array('conditions'=>array('tree_actual_id' => $tree_actual_id ,'tree_user_id' => $tree_user_id)));
            $temp_node_data = $this->Node->find('all',array('conditions'=>array('node_tree_id' => $tree_actual_id,'node_user_id' => $tree_user_id)));

            foreach($temp_node_data as $fur){
                $this->Node->delete($fur['Node']['id']);
            }

            $this->Tree->delete($temp_tree_data['Tree']['id']);


    }
    //test ok


    /*
      * function view() : to view a tree
      *
      * ro return a tree data of a user
      */
    function view(){

        if($this->request->is('post')  && $this->Session->read('magic_id') != null){

            /*
               * to catch all the data
               */
            $result = json_decode(file_get_contents('php://input'));
            $tree_actual_id = $result->tree_actual_id;
            $tree_user_id = $this->Session->read('magic_id');


            /*
                * to find the data of this tree
                */
            $result = $this->Tree->find('first',array('conditions'=>array('tree_actual_id' => $tree_actual_id ,'tree_user_id' => $tree_user_id)));


            if($result != null)
                $result = $result['Tree'];
            else
                $result = null;
            /*
              * to return the result
              */
            $this->set('result',$result);

        }else{
            $this->redirect(array('controller' => 'Users', 'action' => 'index'));
        }
    }
    //test ok


    /*
     * function edit() : to edit tree
     * case 0 : edit failed
     * case 1 : edit succeed!
     *
     */
    function _edit($singleData){
       
            /*
               * to catch all the data
               */

            $this->request->data['tree_actual_id'] = $singleData->tree_actual_id;
            //var_dump($this->request->data['tree_actual_id']);
            $this->request->data['tree_user_id'] =  $this->Session->read('magic_id');
            //$this->request->data['tree_user_id'] =  1;
            $this->request->data['tree_name'] = $singleData->tree_name;
            //var_dump($this->request->data['tree_user_id']);
            $this->request->data['tree_version'] = $singleData->tree_version;
            //var_dump( $this->request->data['tree_versions'] );
            $this->request->data['tree_tags'] = implode(" ",$singleData->tree_tags);
            //var_dump($this->request->data['tree_tags']);
            $this->request->data['tree_view'] = $singleData->tree_view;
            //var_dump($this->request->data['tree_views'] );
            //$this->request->data['tree_node_sums'] = $singleData->tree_node_sums;
            //var_dump($this->request->data['tree_node_sums'] );
            $this->request->data['tree_is_public'] = $singleData->tree_is_public;
            //var_dump($this->request->data['tree_is_public']);
            $this->request->data['tree_style']  = $singleData->tree_style;

            //var_dump($this->request->data['tree_styles'] );
            $this->request->data['tree_dot_x'] = $singleData->tree_dot_x;
            $this->request->data['tree_dot_y'] = $singleData->tree_dot_y;
            $this->request->data['tree_edit_time'] = gmdate("Y-m-d H:i:s", time() + 8 * 3600);

            /*
                * to edit the data of this tree
                */
            $temp_tree_data = $this->Tree->find('first',array('conditions'=>array('tree_actual_id' => $this->request->data['tree_actual_id'] ,'tree_user_id' => $this->request->data['tree_user_id'])));
            $this->request->data['id'] = $temp_tree_data['Tree']['id'];

            $this->Tree->save($this->request->data);

          

    }
    //test ok






} 