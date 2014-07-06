/**
 * 工具类 - 数学类
 * - 主要是仿射几何变换和一些基本的坐标计算
 *
 * @since 1.0
 * @author TEAM-4
 */

/**
 * 工具-数学类
 *
 * @class KT.utils.math
 * @module KT.utils
 * @since 1.0
 */
KT.utils.math = (function () {
    "use strict";
    return {
        /**
         * 传入两个点，返回斜率
         *
         * @method findSlope
         * @param {Dot} Dot1
         * @param {Dot} Dot2
         * @returns {Number | Infinity}
         */
        findSlope: function (Dot1, Dot2) {
            return (Dot2.y - Dot1.y) / (Dot2.x - Dot1.x);
        },

        /**
         * 传入三个Dot对象，计算前Dot1所对应的两边的夹角
         *
         * @method findTriangleTheta
         * @param Dot1
         * @param Dot2
         * @param Dot3
         * @returns {number}
         */
        findTriangleTheta : function (Dot1, Dot2, Dot3) {
            //a为顶点1对应的边
            var a = this.Vector(Dot2, Dot3).vLength,
                b = this.Vector(Dot3, Dot1).vLength,
                c = this.Vector(Dot1, Dot2).vLength;
            if (b === 0 || c === 0) {
                return 0;
            }
            return Math.acos((b*b + c*c - a*a) / (2*b*c));
        },

        /**
         * 求得方向斜率
         *
         * @method findDirection
         * @param compare
         * @param k_1
         * @param k_2
         * @param theta
         * @returns {*}
         */
        findDirection : function (compare, k_1, k_2, theta) {
            //判断坐标系之中的旋转方向问题
            if (k_1 > 0 && k_2 > 0) {
                if (compare[1].x >= 0) {
                    if (compare[2].x >= 0) {
                        if (k_2 >= k_1) {
                            theta *= 1;
                        }
                        else {
                            theta *= -1;
                        }
                    } else {
                        if (k_2 >= k_1) {
                            theta *= -1;
                        }
                        else {
                            theta *= 1;
                        }
                    }
                } else {
                    if (compare[2].x >= 0) {
                        if (k_2 >= k_1) {
                            theta *= -1;
                        }
                        else {
                            theta *= 1;
                        }
                    } else {
                        if (k_2 >= k_1) {
                            theta *= 1;
                        }
                        else {
                            theta *= -1;
                        }
                    }
                }
            } else if (k_1 > 0 && k_2 < 0) {
                if (compare[1].x >= 0) {
                    if (compare[2].x <= 0) {
                        theta *= 1;
                    } else {
                        theta *= -1;
                    }
                } else {
                    if (compare[2].x <= 0) {
                        theta *= -1;
                    } else {
                        theta *= 1;
                    }
                }
            } else if (k_1 < 0 && k_2 > 0) {
                if (compare[1].x >= 0) {
                    if (compare[2].x <= 0) {
                        theta *= -1;
                    } else {
                        theta *= 1;
                    }
                } else {
                    if (compare[2].x <= 0) {
                        theta *= 1;
                    } else {
                        theta *= -1;
                    }
                }
            } else if (k_1 < 0 && k_2 < 0) {
                if (compare[1].x >= 0) {
                    if (compare[2].x >= 0) {
                        if (k_2 >= k_1) {
                            theta *= 1;
                        }
                        else {
                            theta *= -1;
                        }
                    } else {
                        if (k_2 >= k_1) {
                            theta *= -1;
                        }
                        else {
                            theta *= 1;
                        }
                    }
                } else {
                    if (compare[2].x >= 0) {
                        if (k_2 >= k_1) {
                            theta *= -1;
                        }
                        else {
                            theta *= 1;
                        }
                    } else {
                        if (k_2 >= k_1) {
                            theta *= 1;
                        }
                        else {
                            theta *= -1;
                        }
                    }
                }
            }

            return theta;
        },

        /**
         * 偏移量计算函数 | 传入亮点和偏移量，返回生成的坐标点
         *
         * @method findMoveDistance
         * @param {Dot} Dot1
         * @param {Dot} Dot2
         * @param {Number} moveDistance
         * @returns {Dot}
         */
        findMoveDistance: function (Dot1, Dot2, moveDistance) {
            var slope = this.findSlope(Dot1, Dot2),
                theta = Math.atan(slope),
                value;
            if (slope === Infinity) {
                value = this.Dot(Dot2.x, Dot2.y + moveDistance);
            } else {
                if (Dot2.x <= Dot1.x) {
                    value = this.Dot(Dot2.x - moveDistance * Math.cos(theta),
                        Dot2.y - moveDistance * Math.sin(theta));
                } else {
                    value = this.Dot(Dot2.x + moveDistance * Math.cos(theta),
                        Dot2.y + moveDistance * Math.sin(theta));
                }
            }
            return value;
        },

        /**
         * 求两点间的距离（返回整数值的距离）
         *
         * @method findDistance
         * @param {Dot} Dot1
         * @param {Dot} Dot2
         * @returns {Number}
         */
        findDistance: function (Dot1, Dot2) {
            return Math.sqrt(Math.pow(Dot1.y - Dot2.y, 2) + Math.pow(Dot1.x - Dot2.x, 2));
        },

        /**
         * 传入一个中心点和位置点，返回一个象限
         *
         * @method findQuadrant
         * @param {Dot} c
         * @param {Dot} p
         * @return Number 数字表示所在象限
         */
        findQuadrant : function (c, p) {
            var value;
            if (p.x >= c.x && p.y >= c.y) {
                value = 1;
            } else if (p.x <= c.x && p.y >= c.y) {
                value = 2;
            } else if (p.x <= c.x && p.y <= c.y) {
                value = 3;
            } else {
                value = 4;
            }
            return value;
        },

        /**
         * 矩阵乘法
         *
         * @method matrixMultiply
         * @param matrix_a 矩阵的数组
         * @param matrix_b 矩阵的数组
         * @returns {*[]}
         * @example
         */
        matrixMultiply: function (matrix_a, matrix_b) {
            var result = [
                [],
                [],
                []
            ],
                i, j, k,
                sum;

            for (i = 0; i < 3; i += 1) {
                for (j = 0; j < 3; j += 1) {
                    sum = 0;
                    for (k = 0; k < 3; k += 1) {
                        sum += matrix_a[i][k] * matrix_b[k][j];
                    }
                    result[i][j] = sum;
                }
            }
            return result;
        },

        /**
         * 平均缩放转换，放大倍数是scale，源输入矩阵为1*3数组
         *
         * @method transformScale
         * @param {Array} matrix [a,b,c]
         * @param {Number} scale
         * @param {Number} x
         * @param {Number} y
         * @returns {*[]}
         */
        transformScale: function (matrix, scale, x, y) {
            //均匀缩放矩阵由三阶矩阵构成
            var scale_matrix = [
                [scale, 0, 0],
                [0, scale, 0],
                [(1 - scale) * x, (1 - scale) * y, 1]
            ];
            return this.matrixMultiply(matrix, scale_matrix);
        },

        /**
         * 旋转变换
         * 输入两个坐标值，然后让其坐标绕(x,y)点旋转theta的角度
         *
         * @method transformRotation
         * @param {Array} matrix
         * @param {Number} theta
         * @param {Number} x
         * @param {Number} y
         * @returns {*[]}
         */
        transformRotation: function (matrix, theta, x, y) {
            //绕点旋转矩阵由三阶矩阵构成
            var rotateMatrix = [
                [Math.cos(theta), Math.sin(theta), 0],
                [-Math.sin(theta), Math.cos(theta), 0],
                [x * (1 - Math.cos(theta)) + y * Math.sin(theta), -x * Math.sin(theta) + y
                    * (1 - Math.cos(theta)), 1]
            ];
            return this.matrixMultiply(matrix, rotateMatrix);
        },

        /**
         * 点类的构造器函数
         *
         * @method Dot
         * @param {Number} x
         * @param {Number} y
         */
        Dot: function (x, y) {
            x = Number(x);
            y = Number(y);
            return {
                x: x,
                y: y
            };
        },

        /**
         * 给定范围，并给定一个值，返回该值属于哪个范围
         *
         * @method selectRange
         * @param {Number} number
         * @returns {Number}
         * @example
         * console.log(selectRange(23,10,20,30)); //3
         */
        selectRange : function (number) {
            var i = 1;
            while (number >= arguments[i]) {
                i += 1;
            }
            return i;
        },

        /**
         * Vector构造函数，返回有vLength、起始点和终止点的矢量
         *
         * @method Vector
         * @module KT.utils.math
         * @param {Dot} Dot1 Dot对象 起始点
         * @param {Dot} Dot2 Dot对象 终止点
         */
        Vector: function (Dot1, Dot2) {
            //私有变量
            var px = Dot1.x,
                py = Dot1.y,
                qx = Dot2.x,
                qy = Dot2.y,

                vlength = Math.sqrt(Math.pow(qx - px, 2) + Math.pow(qy - py, 2)),
                vtheta = Math.atan2(Dot2.y - Dot1.y, Dot2.x - Dot1.x);

            return {
                //返回公有变量分别表示矢量长度值、开始点、结束点对象
                vLength: vlength,
                startPoint: Dot1,
                endPoint: Dot2,
                theta : vtheta
            };
        }
    };
}());
