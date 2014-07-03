<?php
/**
 * Created by PhpStorm.
 * User: Alan
 * Date: 14-3-12
 * Time: 下午11:04
 */


class UsersController extends AppController{

    var $name = 'Users';
    var $uses = array('User','Tree','Node');

    public $helpers = array('Session');
    public $components = array('Session');



    function index(){}


    /*
     * function view()
     *
     */
    function __view(){

        if($this->request->is('post') && $this->Session->read('magic_id') != null){

            $result = $this->User->find('first',array('conditions' => array('id' => $this->Session->read('magic_id')),'fields' => array('id','user_name','user_mail')));

            if($result != null)
                $result = $result['User'];

            $this->set('result',$result);
        }else{
            $this->redirect(array('controller' => 'Users', 'action' => 'index'));
        }
    }

    /*
     * function sendValidateEmail()
     *

    public function _sendValidateEmail($user_mail,$emailbody,$emailsubject) {
        App::uses('CakeEmail', 'Network/Email');
        $email = new CakeEmail('email');
        $email->from(array('ruxuteng@163.com' => 'Team-4'));
        $email->to($user_mail);
        $email->subject($emailsubject);
        $email->send($emailbody);
    }
    //test ok
     */


    /*
     * function signUp() : to check signUp
     * case 1 : signUp failed
     * case 0 : mailbox has been used
     */

    function signUp(){

       if ($this->request->is('post'))
        {
            /*
             * to catch all the data
             */


            $result = json_decode(file_get_contents('php://input'));


            $user_mail = $result->user_mail;

            //var_dump($user_mail);
            $user_pass = SHA1($result->password);


            $user_testtime = time();
            $user_token = SHA1($user_mail.$user_pass.$user_testtime);//创建用于激活识别码
            $user_token_exptime = time()+60*60*24;//过期时间为24小时后
            //$user_status = 0;
            $user_status = 1;

            /*
             * to check all the data
             */

            if($this->User->isMailExist($user_mail)){

                $data_temp = array('user_mail' => $user_mail,'user_password' => $user_pass,'user_token' => $user_token,'user_token_exptime' => $user_token_exptime,'user_status' => $user_status);
               /*
                $emailbody = "您好：,$user_mail.<br/>感谢您在我站注册了新帐号。<br/>请点击链接激活您的帐号。<br/>
    <a href='http://www.easy-mind.com/Easy-mind/Users/active/".$user_token."' target=
'_blank'>http://www.easy-mind.com/Easy-mind/Users/active/".$user_token."</a><br/>
    如果以上链接无法点击，请将它复制到你的浏览器地址栏中进入访问，该链接24小时内有效。";
                $emailsubject = 'Easy-mind激活邮件';
                $this->_sendValidateEmail($user_mail,$emailbody,$emailsubject);
               */
                $this->User->save($data_temp);

                /*to make new node*/
                $this->request->data = null;
                $result_temp = $this->User->find('first',array('conditions' => array('user_mail' => $user_mail,'user_password' => $user_pass)));

                $this->request->data['tree_actual_id'] = 0;
                //var_dump($this->request->data['tree_actual_id']);
                $this->request->data['tree_user_id'] =  $result_temp['User']['id'];
                $this->request->data['tree_name'] = "New Graph";
                $this->request->data['tree_node_sums'] = 1;
                //var_dump($this->request->data['tree_styles'] );
                $this->request->data['tree_dot_x'] = 0;
                $this->request->data['tree_dot_y'] = 0;
                $this->request->data['tree_create_time'] = gmdate("Y-m-d H:i:s", time() + 8 * 3600);
                $this->Tree->save($this->request->data);

                $this->request->data = null;
                $this->request->data['node_user_id'] = $result_temp['User']['id'];
                $this->request->data['node_create_time'] =  gmdate("Y-m-d H:i:s", time() + 8 * 3600);
                $this->request->data['node_actual_id']  = 0;
                $this->request->data['node_tree_id']  = 0;
                $this->request->data['node_name'] = "New Node";
                $this->request->data['node_level'] = 1;
                $this->request->data['node_view_level'] = 1;
                $this->request->data['node_parent_id'] = null;
                $this->request->data['node_dot_x'] = 0;
                $this->request->data['node_dot_y'] = 0;
                $this->request->data['node_progress'] = 0;
                $this->request->data['node_importance'] = 0;
                $this->Node->save($this->request->data);


                $result = 1;
                $this->set('result',$result);
           }else{
                $result = 0;
                $this->set('result',$result);
            }

        }

    }
    //test ok



    /*
     * function active() : to active account
     * case 0 : active next time
     * case 1 : active succeed
     *

    function active($user_token){


        $result_temp = $this->User->find('first',array('conditions' => array('user_token' => $user_token,'user_status' => 0)));
        $nowtime = time();
        $this->request->data['id'] = $result_temp['User']['id'];
        $this->request->data['user_status'] = 1;
        $this->request->data['user_registime']  = gmdate("Y-m-d H:i:s", time() + 8 * 3600);
        if($nowtime > $result_temp['User']['user_token_exptime']){
            $this->User->delete($this->request->data['id']);
            $result = 0;
        }else{
            $this->User->save($this->request->data);

            $this->request->data = null;
            $this->request->data['tree_actual_id'] = 0;
            //var_dump($this->request->data['tree_actual_id']);
            $this->request->data['tree_user_id'] =  $result_temp['User']['id'];

            $this->request->data['tree_name'] = "New Graph";
            $this->request->data['tree_node_sums'] = 1;          ;

            //var_dump($this->request->data['tree_styles'] );
            $this->request->data['tree_dot_x'] = 0;
            $this->request->data['tree_dot_y'] = 0;

            $this->request->data['tree_create_time'] = gmdate("Y-m-d H:i:s", time() + 8 * 3600);

            $this->Tree->save($this->request->data);

            $this->request->data = null;
            $this->request->data['node_user_id'] = $result_temp['User']['id'];
            $this->request->data['node_create_time'] =  gmdate("Y-m-d H:i:s", time() + 8 * 3600);
            $this->request->data['node_actual_id']  = 0;
            $this->request->data['node_tree_id']  = 0;
            $this->request->data['node_name'] = "New Node";
            $this->request->data['node_level'] = 1;
            $this->request->data['node_view_level'] = 1;
            $this->request->data['node_parent_id'] = null;
            $this->request->data['node_dot_x'] = 0;
            $this->request->data['node_dot_y'] = 0;
            $this->request->data['node_progress'] = 0;
            $this->request->data['node_importance'] = 0;

            $this->Node->save($this->request->data);

            $result = 1;
        }

        $this->set('result',$result);

    }
    //test ok
    */


    /*
     * function logIn() : to check logIn
     * case 0 : user_mail does not exist
     * case 1 : need to active
     * case 2 : wrong name or password
     * case 3 : login succeed
     *
     */
    function logIn(){


        if ($this->request->is('post'))
        {

            /*
             * to catch all the data
             */
            $getResult = json_decode(file_get_contents('php://input'));

            $user_mail = $getResult->user_mail;
            $user_pass = SHA1($getResult->password);

            /*
             * to check all the data
             */
            $this->request->data = $this->User->findByUserMail($user_mail);
             //var_dump($data_temp['User']['user_password']);
             //var_dump($user_pass);
            if($this->request->data != null){
                if($this->request->data['User']['user_status'] == 1){
                    if($user_pass ==  $this->request->data['User']['user_password']){

                        /*
                         * Session start();
                         */
                        $this->Session->write('magic_mail', $this->request->data['User']['user_mail']);
                        $this->Session->write('magic_id', $this->request->data['User']['id']);

                        //下次调用只需$this->Session->read('magic_mail');
                        $this->User->save(array('id' =>  $this->request->data['User']['id'],'user_logintime' => gmdate("Y-m-d H:i:s", time() + 8 * 3600)));

                        $result[0] = 3;//登录成功

                        //return all the data of user
                        $tempResult = $this->User->find('first',array('conditions' => array('id' => $this->Session->read('magic_id')),'fields' => array('id','user_name','user_mail')));

                        if($tempResult != null)
                            $result[1] = $tempResult['User'];
                        else
                            $result[1] = null;

                        //return all the data of user
                        $tempResult1 = $this->Tree->find('all',array('conditions' => array('tree_user_id' => $this->Session->read('magic_id'))));


                        if($tempResult1 != null){
                            foreach($tempResult1 as $fur)
                                    $result[2][] = $fur['Tree'];
                        }else
                            $result[2] = null;


                    }else
                        $result[0] = 2;//账号或密码不正确
                }else
                    $result[0] = 1;//账号尚未激活
            }else
                $result[0] = 0;//账号尚未注册


            /*
             * to return the result
             */
             $this->set('result',$result);

            }

    }
    //test ok


    /*
    * function logOut() : to check logOut
    * case 1 : logOut succeed
    */
    function logOut(){

        /*
         * Session destroy
         */
        $this->Session->delete('magic_mail');
        $this->Session->delete('magic_id');

        $result = 1;

        /*
            * to return the result
            */
        $this->set('result',$result);

    }
    //test ok


    /*
    * function edit() : to edit the data of a user
     *cese 0 : edit failed
    * case 1 : edit succeed
    */
    function editUsername(){

        if($this->request->is('post') && $this->Session->read('magic_id') != null){
          /*
           * to catch all the data
           */
            $result = json_decode(file_get_contents('php://input'));
            $this->request->data['user_name'] = $result->user_name;
            $this->request->data['user_password'] = $result->password;
            $this->request->data['user_icon'] = $result->user_icon;
            $this->request->data['id'] =  $this->Session->read('magic_id');


            if($this->User->isNameExist($this->request->data['user_name'])){
              /*
               * to edit the data of this tree
               */
               $this->User->save($this->request->data);
               $result = 1;
            }else
               $result = 0;


            /*
            * to return the result
             */
            $this->set('result',$result);
        }else
            $this->redirect(array('controller' => 'Users', 'action' => 'index'));
    }
    //need to test


    /*
    * function findPass()
     *

    function findPass(){

        if ($this->request->is('post'))
        {


            $result = json_decode(file_get_contents('php://input'));
            $user_mail = $result->user_mail;
            //$user_mail = 'ruxuteng@qq.com';


            if(!$this->User->isMailExist($user_mail)){

                $temp = $this->User->findByUserMail($user_mail);

                if($temp['User']['user_status'] == 1){
                    $temp_key = $this->_hash(String::uuid(),'sha1',true);
                    $this->request->data['user_key'] = $temp_key;
                    $this->request->data['id'] = $temp['User']['id'];


                    $this->User->save($this->request->data);


                    $emailbody = "您好：,$user_mail.<br/>感谢您在我站注册了帐号。<br/>请点击链接修改您的密码。<br/>
    <a href='http://www.easy-mind.com/Easy-mind/Users/change/".$temp_key."' target=
'_blank'>http://www.easy-mind.com/Easy-mind/Users/change/".$temp_key."</a><br/>";
                    $emailsubject = 'Ktree修改密码邮件';

                    $this->_sendValidateEmail($user_mail,$emailbody,$emailsubject);
                    $result = 1;//修改密码相关邮件已发送
                }else{
                    $result = 2;//该邮箱已注册但尚未激活
                }

            }else
                $result = 0;//该邮箱尚未注册


            $this->set('result',$result);

        }else
           $this->redirect(array('controller' => 'Users', 'action' => 'index'));
    }

    */


    /*
    * function change()
     *to find whether or not to change

    function change($key){

        $temp = $this->User->find('first',array('conditions' => array('user_key' => $key)));


        if($temp != NULL){
            $this->Session->write('change_password_id',$temp['User']['id']);
            $result = 1;
        }else
            $result = 0;

        $this->set('result',$result);

    }
    //test ok
    */

    /*
    * function change()
     *to change real

    function changePassword(){

        if ($this->request->is('post')){

            $result = json_decode(file_get_contents('php://input'));
            $this->request->data['user_password']  = $result->password;

            $this->request->data['id'] = $this->Session->read('change_password_id');

            $this->User->save($this->request->data);

            $this->Session->delete('change_password_id');

            $result = 1;

            $this->set('result',$result);

        }else
            $this->redirect(array('controller' => 'Users', 'action' => 'index'));

    }
    //test ok


    function _hash($string, $type = null, $salt = false) {
        if (empty($type)) {
            $type = self::$hashType;
        }
        $type = strtolower($type);

        if ($type === 'blowfish') {
            return self::_crypt($string, $salt);
        }
        if ($salt) {
            if (!is_string($salt)) {
                $salt = Configure::read('Security.salt');
            }
            $string = $salt . $string;
        }

        if (!$type || $type === 'sha1') {
            if (function_exists('sha1')) {
                return sha1($string);
            }
            $type = 'sha256';
        }

        if ($type === 'sha256' && function_exists('mhash')) {
            return bin2hex(mhash(MHASH_SHA256, $string));
        }

        if (function_exists('hash')) {
            return _hash($type, $string);
        }
        return md5($string);
    }

*/


}
