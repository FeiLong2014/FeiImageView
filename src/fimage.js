/**
 * 查看器 图片类
 * @file
 * @module Fei
 * @class fImage
 * @since 1.0.0
 */

(function () {
    var utils = Fei.utils;

    /**
     * 定义图片对象
     * @constructor
     * @param { Object } config 配置
     */
    var fImage = Fei.fImage = function (config) {
        var me = this;

        me.isLoaded = false;
        me.src = '';
        me.orgWidth = 0;
        me.orgHeight = 0;
        me.width = 0;
        me.height = 0;
        me.rotation = 0;
        me.translateSpeed = 300;
        me.translates = {
            y: 0,
            x: 0
        }
        me.domId = 'fei_imgview_' + utils.getGuid();
        me.dom = utils.createElement('img', {
            id: me.domId
        });
        //event 图片加载完成触发
        me.onload = function () { };
        if (config) {
            for (var item in config) {
                me[item] = config[item];
            }
        }
        me.orgTranslateSpeed = me.translateSpeed;
    }

    fImage.prototype = {
        /**
         * 初始化
         * @method init
         * @return { Object } fImage对象
         */
        init: function () {
            var me = this;

            if (me.src) {
                me.setSrc(me.src);
            }

            if (me.dom.complete) {
                me.imgLoad.call(me);
            } else {
                me.dom.onload = function () {
                    me.imgLoad.call(me);
                }
                me.dom.onreadystatechange = function () {
                    if (this.readyState == "complete") {
                        me.imgLoad.call(me);
                    }
                }
            }

            return me;
        },

        /**
         * 图片加载完成的处理逻辑 
         * 初始化参数
         * 回调fimage的onload事件
         * @method imgLoad
         */
        imgLoad: function () {
            var me = this;
            if (me.isLoaded) {
                return;
            }
            me.isLoaded = true;
            try {
                var imgObj = new Image();
                imgObj.src = me.src;

                me.width = imgObj.width;
                me.height = imgObj.height;
                me.orgWidth = imgObj.width;
                me.orgHeight = imgObj.height;
                me.rotation = 0;

                delete imgObj
            } catch (e) { }

            if (me.onload) {
                me.onload.call(window, me);
            }
        },

        /**
         * 设置图片路径
         * @method setSrc
         * @param { String } 当前图片的地址
         * @return { Object } fImage对象
         */
        setSrc: function (src) {
            var me = this;

            me.isLoaded = false;
            me.src = src || me.src;
            me.dom.src = me.src;

            if (me.dom.complete) {
                me.imgLoad.call(me);
            }
            return me;
        },

        /**
         * 应用图片样式变动 其余方法只负责算出变动值 必须调用doChange方法才能将样式变动提现到dom元素上边
         * @method doChange
         * @return { Object } fImage对象
         */
        doChange: function () {
            var me = this,
                img = document.getElementById(me.domId);

            if (!img) {
                return;
            }

            if (utils.isUseVml()) {
                img.style.left = me.translates.x + 'px';
                img.style.top = me.translates.y + 'px';
                if (!me.isMoveing) {
                    img.style.cursor = 'move';
                    img.style.width = me.width + 'px';
                    img.style.height = me.height + 'px';

                    var cNodes = img.children || img.childNodes;
                    if (cNodes.length > 0) {
                        var cGroup = cNodes[0];
                        cGroup.style.width = me.width + 'px';
                        cGroup.style.height = me.height + 'px';
                    }

                    Fei.ieRotate.rotate(document.getElementById(me.domId), {
                        animateTo: me.rotation,
                        duration: me.translateSpeed
                    });
                }
            } else {
                var style = 'cursor:move;width:' + me.width + 'px;height:' + me.height + 'px;';
                style += utils.getBrowserStyle('transform', 'translate(' + me.translates.x + 'px,' + me.translates.y + 'px) rotate(' + me.rotation + 'deg)');
                if (me.translateSpeed > 0) {
                    style += utils.getBrowserStyle('transition', 'all ' + me.translateSpeed / 1000 + 's ease');
                }
                utils.setAttr(img, 'style', style);
            }
            return me;
        },

        /**
         * 放大 缩小
         * @method scale
         * @param { Number } 倍数 如 1.1 or 0.9
         * @return { Object } fImage对象
         */
        scale: function (val) {
            var me = this,
                rotation = me.rotation % 360,
                imgAdSize = me.getAdSize(),
                marginAdjustment = 0;

            me.width = me.width * val;
            me.height = me.height * val;
            if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
                marginAdjustment = (imgAdSize.h - imgAdSize.w) / 2;
            }
            me.transition(me.translates.x - (me.width - imgAdSize.w) / 2 + marginAdjustment,
                me.translates.y - (me.height - imgAdSize.h) / 2 - marginAdjustment);

            return me;
        },

        /**
         * 移动
         * @method transition
         * @param { Number } 水平位移 向右
         * @param { Number } 垂直位移 向下
         * @return { Object } fImage对象
         */
        transition: function (x, y) {
            var me = this;

            me.translates.y = y;
            me.translates.x = x;

            return me;
        },

        /**
         * 旋转
         * @method rotate
         * @param { Number } 角度 例如: 90
         * @return { Object } fImage对象
         */
        rotate: function (val) {
            var me = this;

            me.rotation = me.rotation + val;

            return me;
        },

        /**
         * 获取当前图片真实宽、高。 (旋转、放大后进行换算，即为当前页面所呈现的图像宽、高)
         * @method getAdSize
         * @return { Object } 例如 {w:600, h:400}
         */
        getAdSize: function () {
            var me = this,
                rotation = me.rotation % 360,
                imgAdWidth = me.width,
                imgAdHeight = me.height;

            if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
                imgAdWidth = me.height;
                imgAdHeight = me.width;
            }
            return {
                w: imgAdWidth,
                h: imgAdHeight
            };
        }
    }
})();