
/*
 eg user signUp
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/Users/signUp',
 data: {

 'user_mail' : 'ruxuteng@gmail.com',
 'password' : '19940313teng'

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg user logIn
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/Users/logIn',
 data: {

 'user_mail' : 'ruxuteng@gmail.com',
 'password' : '19940313teng'

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg user logOut
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/Users/logOut',
 data: {

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg tree add
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/trees/add',
 data: {


 'tree_actual_id' : 1,
 'tree_version' : 'v1.0',
 'tree_tags' : ['语文','数学','英语'],
 'tree_view' : 2,
 'tree_name' : 'treename2',
 'tree_is_public' : 1,
 'tree_style' : '白色'


 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg tree viewAll
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/trees/index',
 data: {


 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg tree view
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/trees/view',
 data: {

 'tree_actual_id' : 1
 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg tree edit
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/trees/edit',
 data: {


 'tree_actual_id' : 1,
 'tree_version' : 'v1.0',
 'tree_tags' : ['英语'],
 'tree_view' : 2,
 'tree_node_sums' : 0,
 'tree_name' : 'treename2',
 'tree_is_public' : 1,
 'tree_style' : '白色'
 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 */

/*
 eg tree delete
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/trees/delete',
 data: {


 'tree_actual_id' : 1

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg node add
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/nodes/add',
 data: {

 'node_actual_id' : 1,
 'tree_actual_id' : 1,
 'node_name' : 'nodename8',
 'node_type' : 1,
 'node_note' : 'nodenote8',
 'node_level' : 1,
 'node_parent_id' : null,
 'node_dot1_x' : 0.12,
 'node_dot1_y' : 0.23,
 'node_dot2_x' : 0.34,
 'node_dot2_y' : 0.45,
 'node_progress' : 1,
 'node_importance' : 2
 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */
/*
 eg node view
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/nodes/view',
 data: {

 'node_actual_id' : 2,
 'tree_actual_id' : 2

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg node viewAll
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/nodes/viewAll',
 data: {


 'tree_actual_id' : 2

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */

/*
 eg node edit
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/nodes/edit',
 data: {

 'node_actual_id' : 1,
 'tree_actual_id' : 1,
 'node_name' : 'nodename8',
 'node_type' : 2,
 'node_note' : 'nodenote8',
 'node_level' : 1,
 'node_parent_id' : null,
 'node_child_ids' : ['2','3'],
 'node_dot1_x' : 0.12,
 'node_dot1_y' : 0.23,
 'node_dot2_x' : 0.34,
 'node_dot2_y' : 0.45,
 'node_progress' : 1,
 'node_importance' : 2



 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */
/*
 eg node delete
 */
/*
 $(document).ready(function(){
 var ajax_conf = {
 type: 'POST',
 url: '../../../ktrees/nodes/delete',
 data: {

 'node_actual_id' : 1,
 'tree_actual_id' : 1

 },
 dataType: 'json',
 success: function () {
 alert('Successfully POST');
 }
 };
 $.ajax(ajax_conf);
 });
 */



/**
 * Created by Gregary on 14-3-16.
 */
