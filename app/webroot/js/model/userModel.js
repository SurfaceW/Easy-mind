/**
 * user的Model实例
 *
 * @since 1.0
 * @author TEAM-4
 */
(function () {
    "use strict";

    var tool = KT.utils.tool,

        /**
         * 用户Model
         * + 注意：这个是Model的扩展实例
         *
         * @class KT.model.user
         * @extends KT.Model
         * @module KT.model
         * @uses KT.utils.tool
         * @since 1.0
         */
            userModel = new KT.Model({
            /**
             * 用户名
             *
             * @property userName
             * @type String
             */
            userName: null,
            /**
             * 用户ID
             *
             * @property userId
             * @type Number
             */
            userId: null,
            /**
             * 用户E-Mail
             *
             * @property email
             * @type String
             */
            email: null
        });

    tool.extend(userModel, {
        /**
         * 设置用户的相关数据
         *
         * @method setUserData
         * @param {Object} response
         * @example
         * KT.model.user.setUserData({
         *  userName : 'yeqingnan',
         *  userId : 34,
         *  email : 'yeqingnan@live.cn'
         * });
         */
        setUserData: function (response) {
            this.setGroup({
                userName: response.user_name,
                userId: response.id,
                email: response.user_mail
            });
        }
    });

    //构建user实例
    KT.model.user = userModel;
}());