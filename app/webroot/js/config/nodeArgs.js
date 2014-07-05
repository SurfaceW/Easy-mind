/**
 * KGraph的节点参数配置
 *
 * @since 1.0
 * @author TEAM-4
 */


/**
 * KGraph节点参数配置
 *
 * @class KT.config.nodeArgs
 * @module KT.config
 * @since 1.0
 */
KT.config.nodeArgs = {
    //@todo 由于没有最终确定，所以里面的值暂时不注释，以免无用功
    MAIN : {
        COLOR : {
            base : '57,181,74',
            level1 : 0.35,
            level2 : 0.4,
            level3 : 0.5,
            level4 : 0.6
        },
        FONT : {
            size : 16,
            color : 'rgb(255,255,255)'
        },
        INI_RADIUS: 80
    },

    FREE_GRAPH : {
        COLOR : {
            background : {
                level1 : 'rgb(156,218,164)',
                level2 : 'rgb(186,229,192)',
                level3 : 'rgb(215,240,219)',
                level4 : 'rgb(232,246,235)'
            },
            bgColor : 'rgba(57,181,74,0.2)'
        },

        FONT : {
            color : {
                level1 : 'rgb(113,113,113)',
                level2 : 'rgb(128,128,128)',
                level3 : 'rgb(157,157,157)',
                level4 : 'rgb(164,164,164)'
            },

            size : {
                level1 : 20,
                level2 : 16,
                level3 : 14,
                level4 : 12
            }
        },

        RADIUS : {
            level1 : 80,
            level2 : 60,
            level3 : 50,
            level4 : 40
        },

        LINE_WIDTH : {
            level1 : 4,
            level2 : 3,
            level3 : 2,
            level4 : 1
        },

        LINE_COLOR : 'rgb(153,211,181)'
    },

    WORDS : {
        //文字绘制的尺寸（单位为像素）
        SIZE : {
            level1 : 20,
            level2 : 18,
            level3 : 16,
            level4 : 14,
            level5 : 12
        },

        //文字字族
        FONT_TYPE : 'Microsoft YaHei'
    },

    NODE : {
        //Hover的透明度增值
        ALPHA_HOVER : 0.2,

        //主视图下单节点的圆圈的颜色
        COLOR : "143,209,130,"
    }
};
