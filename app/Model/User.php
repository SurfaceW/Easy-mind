<?php
/**
 * Created by PhpStorm.
 * User: Alan
 * Date: 14-3-12
 * Time: 下午11:07
 */

class User extends AppModel{

    var $name = 'User';

    /*
    * private function __isMailExist() : to check the mailbox
    * case 0 :the mailbox has been used before
    * case 1 :the mailbox can be used now
   */
    function isMailExist($user_mail){

        // var_dump($user_mail);
        $name_temp = $this->find('first',array('conditions' => array('user_mail' => $user_mail)));


         if($name_temp != NULL)
             return 0;
         else
              return 1;


    }

    /*
    * private function __isNameExist() : to check the username
    * case 0 :the username has been used before
    * case 1 :the username can be used now
   */
    function isNameExist($user_name){


        $name_temp = $this->find('first',array('conditions' => array('user_name' => $user_name)));
        //var_dump( $name_temp);

        if($name_temp != NULL)
            return 0;
        else
            return 1;


    }



}