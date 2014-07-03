<?php
/**
 * Created by PhpStorm.
 * User: Alan
 * Date: 14-3-12
 * Time: 下午11:05
 */



class NodesController extends AppController{

    var $name = 'Nodes';
    var $uses = array('Node','Tree');


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
    function viewPdf(){
       $string = 'Hello,world';
       //$this->layout = 'pdf';
       $this->set('result',$string);
       $this->render();
    }
    */


    /*
      * function viewAll() : to view all the nodes of a tree
      *
      */
    function  viewAll(){

        if($this->request->is('post') && $this->Session->read('magic_id') != null){
            /*
            * to catch all the data
            */
            $result = json_decode(file_get_contents('php://input'));

            $node_tree_id = $result->tree_actual_id;
            $node_user_id = $this->Session->read('magic_id');
            //$node_user_id = 2;

            /*
               * to find all the data
               */
            $result_temp = $this->Node->find('all',array('conditions' => array('node_tree_id' => $node_tree_id,'node_user_id' => $node_user_id)));

            $result = array();

            if($result_temp != null){
                foreach($result_temp as $fur)
                    $result[] = $fur['Node'];
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
       * function add() : to add node
       *
       * case 1 : add succeed!
       *
       */
    function _add($singleData){

            /*
            * to catch all the data
            */
        $this->request->data['node_user_id'] = $this->Session->read('magic_id');
        $this->request->data['node_create_time'] =  gmdate("Y-m-d H:i:s", time() + 8 * 3600);
        $this->request->data['id'] = null;
        $this->request->data['node_actual_id']  = $singleData->node_actual_id;
        $this->request->data['node_tree_id']  = $singleData->tree_actual_id;
        $this->request->data['node_name'] = $singleData->node_name;
        $this->request->data['node_note'] = $singleData->node_note;
        $this->request->data['node_level'] = $singleData->node_level;
        $this->request->data['node_view_level'] = $singleData->node_view_level;
        $this->request->data['node_parent_id'] =$singleData->node_parent_id;
        $this->request->data['node_dot_x'] = $singleData->node_dot_x;
        $this->request->data['node_dot_y'] = $singleData->node_dot_y;
        $this->request->data['node_progress'] = $singleData->node_progress;
        $this->request->data['node_importance'] = $singleData->node_importance;


        /*
        * to save this node
        */
        $this->Node->save($this->request->data);

            /*
             * to Update another node
             *
             */
            if($this->request->data['node_actual_id'] !=  0){

                //to find parent node's id
                $temp_use1 = $this->Node->find('first',array('conditions'=>array('node_actual_id' => $this->request->data['node_parent_id'] ,'node_tree_id' => $this->request->data['node_tree_id'],'node_user_id' => $this->request->data['node_user_id'])));
                $temp_parent_id = $temp_use1['Node']['id'];
                //to find children node's id
                $temp_use2 = $this->Node->find('first',array('conditions'=>array('id' => $temp_parent_id)));
                //convert to an array
                $temp_use3 = explode(" ",$temp_use2['Node']['node_child_ids']);
                //add this node id
                $temp_use3[] = $this->request->data['node_actual_id'];
                //sort
                sort($temp_use3);
                //convert to a string
                $temp_child_ids = implode(" ",$temp_use3);
                //to update parent data
                $this->Node->save(array('id' => $temp_parent_id , 'node_child_ids' => $temp_child_ids));

            }



            $temp_use4 = $this->Tree->find('first',array('conditions'=>array('tree_actual_id' => $this->request->data['node_tree_id'],'tree_user_id' => $this->request->data['node_user_id'])));
            $temp_tree_id = $temp_use4['Tree']['id'];
            $temp_tree_node_sums = $temp_use4['Tree']['tree_node_sums'] + 1;
            $this->Tree->save(array('id' => $temp_tree_id,'tree_node_sums' => $temp_tree_node_sums));




    }
    //test ok


    /*
       * function delete() : to add node
       *
       * case 1 : delete succeed!
       *
       */
    function _delete($singleData){


           /*
           * to catch all the data
           */
            $this->request->data['node_user_id'] = $this->Session->read('magic_id');
            $this->request->data['node_actual_id'] = $singleData->node_actual_id;
            $this->request->data['node_tree_id']  = $singleData->tree_actual_id;

            //$this->request->data['node_user_id'] = 2;
            /*
             *  update its parent's id
             */
            if($this->request->data['node_actual_id'] !=  0){

                //to find this node's parent's actual id
                $temp_use0 = $this->Node->find('first',array('conditions'=>array('node_actual_id' => $this->request->data['node_actual_id'],'node_tree_id' => $this->request->data['node_tree_id'] ,'node_user_id' => $this->request->data['node_user_id'])));
                $temp_parent_actual_id = $temp_use0['Node']['node_parent_id'];

                //to find parent node's final id
                $temp_use1 = $this->Node->find('first',array('conditions'=>array('node_actual_id' => $temp_parent_actual_id ,'node_tree_id' => $this->request->data['node_tree_id'],'node_user_id' => $this->request->data['node_user_id'])));
                $temp_parent_id = $temp_use1['Node']['id'];

                //to find children node's id
                $temp_use2 = $this->Node->find('first',array('conditions'=>array('id' => $temp_parent_id)));
                //convert to an array
                $temp_use3 = explode(" ",$temp_use2['Node']['node_child_ids']);
                //delete this node id
                $temp_key = array_search($this->request->data['node_actual_id'],$temp_use3);
                    unset($temp_use3[$temp_key]);
                //remake this array
                $temp_use3 = array_values($temp_use3);
                //sort
                sort($temp_use3);
                //convert to a string
                $temp_use4 = implode(" ",$temp_use3);
                //insert to its parent
                $this->Node->save(array('id' => $temp_parent_id , 'node_child_ids' => $temp_use4));


            }


       /*
       * delete other child node
       */
       $this->Session->write('magic_count',0);
       $this->_delAll($this->request->data['node_actual_id'],$this->request->data['node_tree_id'], $this->request->data['node_user_id']);


        // to update another table

       $temp_use5 = $this->Tree->find('first',array('conditions'=>array('tree_actual_id' => $this->request->data['node_tree_id'],'tree_user_id' => $this->request->data['node_user_id'])));
       $temp_tree_id = $temp_use5['Tree']['id'];
       $temp_tree_node_sums = $temp_use5['Tree']['tree_node_sums'] - $this->Session->read('magic_count');
       $this->Tree->save(array('id' => $temp_tree_id,'tree_node_sums' => $temp_tree_node_sums));

       $this->Session->delete('magic_count');




    }
    //test ok


    /*
      * function view() : to view a node
      *
      * ro return a node data of a tree
      */
    function view(){

        if($this->request->is('post') && $this->Session->read('magic_id') != null){

            /*
               * to catch all the data
               */
            $result = json_decode(file_get_contents('php://input'));
            $node_actual_id = $result->node_actual_id;
            $node_tree_id = $result->tree_actual_id;
            $node_user_id = $this->Session->read('magic_id');
            //$node_user_id = 2;

            /*
                * to find the data of this tree
                */
            $result = $this->Node->find('first',array('conditions'=>array('node_actual_id'=>$node_actual_id,'node_tree_id' => $node_tree_id ,'node_user_id' => $node_user_id)));

            if($result != null)
                $result = $result['Node'];
            else
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
       * function edit() : to edit node
       * case 0: failed
     *   case 1: succeed
       */
    function _edit($singleData){


            /*
        * to catch all the data
        */
        $this->request->data['node_user_id'] = $this->Session->read('magic_id');
        $this->request->data['node_edit_time'] =  gmdate("Y-m-d H:i:s", time() + 8 * 3600);

            $this->request->data['node_actual_id'] = $singleData->node_actual_id;
            $this->request->data['node_tree_id']  = $singleData->tree_actual_id;
            $this->request->data['node_name'] = $singleData->node_name;
            $this->request->data['node_note'] = $singleData->node_note;
            $this->request->data['node_level'] = $singleData->node_level;
            $this->request->data['node_view_level'] = $singleData->node_view_level;
            $this->request->data['node_parent_id'] = $singleData->node_parent_id;
            $this->request->data['node_dot_x'] = $singleData->node_dot_x;
            $this->request->data['node_dot_y'] = $singleData->node_dot_y;
            $this->request->data['node_progress'] = $singleData->node_progress;
            $this->request->data['node_importance'] = $singleData->node_importance;

        if($singleData->node_child_ids != null){
            $this->request->data['node_child_ids'] = implode(" ",$singleData->node_child_ids);//$_POST['node_child_ids'];
        }else
            $this->request->data['node_child_ids']  = null;
            //to find this node's parent's actual id
            $temp_use0 = $this->Node->find('first',array('conditions'=>array('node_actual_id' => $this->request->data['node_actual_id'],'node_tree_id' => $this->request->data['node_tree_id'] ,'node_user_id' => $this->request->data['node_user_id'])));
            $this->request->data['id'] = $temp_use0['Node']['id'];

        $this->Node->save($this->request->data);



    }
    //test ok

    /*
      * function delAll() : to delete child nodes
      *
      */
    function _delAll($node_actual_id,$node_tree_id,$node_user_id){
        //to find this node's child's actual id
        $temp_del = $this->Node->find('first',array('conditions'=>array('node_actual_id' => $node_actual_id,'node_tree_id' => $node_tree_id,'node_user_id' => $node_user_id)));
        if($temp_del != null){

            $temp_child_ids_1 = $temp_del['Node']['node_child_ids'];
            $temp_node_id = $temp_del['Node']['id'];
           // var_dump($temp_del['Node']['node_actual_id']);

            //delete this node
            $this->Node->delete($temp_node_id);
            //count OMG
            $this->Session->write('magic_count',$this->Session->read('magic_count')+1);
           // var_dump($this->Session->read('magic_count'));

            if($temp_child_ids_1 != null){
                //convert to an array
                $temp_child_ids_2 = explode(" ",$temp_child_ids_1);
                foreach($temp_child_ids_2 as $fur){
                    $this->_delAll($fur,$node_tree_id,$node_user_id);
                }

            }

        }

    }
    //test ok


} 