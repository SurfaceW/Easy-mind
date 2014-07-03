/**
 * Created by yeqingnan on 14-5-29.
 */
window.define('math', ['a'], function (a) {
    var privateA = a.a;
    return {
        add : function (b) {
            console.log(privateA + b);
        }
    };
});