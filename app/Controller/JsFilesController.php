<?php
/**
 * Created by PhpStorm.
 * User: yeqingnan
 * Date: 14-5-29
 * Time: 21:05
 */

class JsFilesController extends AppController{
    function index(){
        if($this->request->is('post')){
            $result_temp = json_decode(file_get_contents('php://input'));
            $result = $result_temp->data->name;
            $this->set('result',$result);
        }

    }
} 