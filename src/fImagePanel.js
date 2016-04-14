/**
 * 查看器 图片容器类
 * @file
 * @module Fei
 * @class fImagePanel
 * @since 1.0.0
 */

(function () {
    var utils = Fei.utils;

    /**
     * 定义图片容器
     * @constructor
     * @param { Object } config 配置
     */
    var fImagePanel = Fei.fImagePanel = function (config) {
        var me = this;

        me.width = 0;
        me.height = 0;
        me.images = [];
        me.currentIndex = 0;
        me.dom = utils.createElement('div', {
            style: 'position:relative;text-align:left;width:100%;height:100%;display:block;overflow:hidden;'
        });

        if (config) {
            for (var item in config) {
                me[item] = config[item];
            }
        }
    }

    fImagePanel.prototype = {
        /**
         * 初始化 内部图片对象 IE6 7 8初始化一个新对象
         * @method initImage
         * @param { HTMLElement } 容器父级元素
         * @return { Object } fImagePanel对象
         */
        initImage: function (src) {
            var me = this;

            me.image = new Fei.fImage({
                src: src || '',
                container: me,
                onload: function () {
                    me.stretchOptimally().centerImage().doChange();
                }
            });
            if (!src) {
                me.image.setSrc(me.images[me.currentIndex]);
            }
            utils.removeChildren(me.dom);
            me.dom.appendChild(me.image.dom);
            me.image.init();
            me.initEvents();

            return me;
        },

        /**
         * 渲染
         * @method render
         * @param { HTMLElement } 容器父级元素
         * @return { Object } fImagePanel对象
         */
        render: function (pDom) {
            var me = this;

            (pDom || document.body).appendChild(me.dom);
            me.width = me.dom.offsetWidth;
            me.height = me.dom.offsetHeight;
            me.initImage();

            return me;
        },

        /**
         * 设置图片列表
         * @method setImages
         * @param { Array } 图片地址的数组
         * @return { Object } fImagePanel对象
         */
        setImages: function (images) {
            var me = this;

            me.images = images;
            me.currentIndex = 0;
            me.image.setSrc(me.images[me.currentIndex]);

            return me;
        },

        /**
         * 初始化事件
         * @method initEvents
         * @return { Object } fImagePanel对象
         */
        initEvents: function () {
            var me = this,
                img = document.getElementById(me.image.domId);

            utils.addEvent(img, 'mousedown', me.mousedown, me);
            utils.addEvent(img, 'mousemove', me.mousemove, me);
            utils.addEvent(img, 'mouseup', me.mouseup, me);
            utils.addEvent(img, 'mouseout', me.mouseup, me);

            return me;
        },

        /**
         * 鼠标按下
         * @event mousedown
         */
        mousedown: function (ev) {
            var me = this,
                ev = ev || window.event,
                img = me.image;

            me.lastTranslateX = img.translates.x;
            me.lastTranslateY = img.translates.y;
            me.moveStartX = ev.x || ev.clientX;
            me.moveStartY = ev.y || ev.clientY;
            me.isMoveing = true;
            img.isMoveing = true;

            img.translateSpeed = 0;

            if (ev.stopPropagation) {
                ev.stopPropagation();
            }
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            window.event ? window.event.returnValue = false : ev.preventDefault();
        },

        /**
         * 鼠标移动
         * @event mousemove
         */
        mousemove: function (ev) {
            var me = this,
                ev = ev || window.event,
                img;
            if (me.isMoveing) {
                img = me.image;
                var x = (ev.x || ev.clientX) - me.moveStartX + me.lastTranslateX;
                var y = (ev.y || ev.clientY) - me.moveStartY + me.lastTranslateY;
                me.image.transition(x, y);
                me.image.doChange();
            }
            if (ev.stopPropagation) {
                ev.stopPropagation();
            }

            if (ev.preventDefault) {
                ev.preventDefault();
            }
            window.event ? window.event.returnValue = false : ev.preventDefault();
        },

        /**
         * 鼠标放开
         * @event mouseup
         */
        mouseup: function (ev) {
            var me = this;
            me.isMoveing = false;
            me.image.isMoveing = false;
            me.image.translateSpeed = me.image.orgTranslateSpeed;
        },

        /**
         * 应用图片样式变动 其余方法只负责算出变动值 必须调用doChange方法才能将样式变动提现到dom元素上边
         * @method doChange
         * @return { Object } fImagePanel对象
         */
        doChange: function () {
            var me = this,
                img = me.image;

            img.doChange();

            return me;
        },

        /**
         * 垂直拉伸
         * @method stretchH
         * @return { Object } fImagePanel对象
         */
        stretchH: function () {
            var me = this,
                img = me.image;

            img.width = me.width;
            img.height = img.orgHeight * me.width / img.orgWidth;

            return me;
        },

        /**
         * 水平拉伸
         * @method stretchV
         * @return { Object } fImagePanel对象
         */
        stretchV: function () {
            var me = this,
                img = me.image;

            img.height = me.height;
            img.width = img.orgWidth * me.height / img.orgHeight;

            return me;
        },

        /**
         * 原始尺寸
         * @method originalOptimally
         * @return { Object } fImagePanel对象
         */
        originalOptimally: function () {
            var me = this,
                img = me.image;

            img.width = img.orgWidth;
            img.height = img.orgHeight;

            return me;
        },

        /**
         * 最佳显示
         * @method stretchOptimally
         * @return { Object } fImagePanel对象
         */
        stretchOptimally: function () {
            var me = this,
                img = me.image;

            if (img.orgHeight <= me.height && img.orgWidth <= me.width) {
                me.originalOptimally();
            } else {
                if (img.orgWidth * me.height / img.orgHeight > me.width) {
                    me.stretchH();
                } else {
                    me.stretchV();
                }
            }

            return me;
        },

        /**
         * 图片居中
         * @method centerImage
         * @return { Object } fImagePanel对象
         */
        centerImage: function () {
            var me = this,
                img = me.image,
                rotation = img.rotation % 360,
                imgAdSize = img.getAdSize(),
                marginAdjustment = 0;

            if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
                marginAdjustment = (imgAdSize.h - imgAdSize.w) / 2;
            }
            var x = (me.width - imgAdSize.w) / 2 - marginAdjustment;
            var y = (me.height - imgAdSize.h) / 2 + marginAdjustment;
            img.transition(x, y);

            return me;
        },

        /**
         * 旋转
         * @method rotate
         * @param { Number } 角度 例如: 90
         * @return { Object } fImagePanel对象
         */
        rotate: function (val) {
            var me = this,
                img = me.image;

            img.rotate(val);

            return me;
        },

        /**
         * 放大 缩小
         * @method scale
         * @param { Number } 倍数 如 1.1 or 0.9
         * @return { Object } fImagePanel对象
         */
        scale: function (val) {
            var me = this,
                img = me.image;

            img.scale(val);

            return me;
        },

        /**
         * 切换图片
         * @method switchTo
         * @param { Number } index
         * @return { Object } fImagePanel对象
         */
        switchTo: function (index) {
            var me = this,
                img = me.image;

            if (utils.isUseVml()) {
                me.initImage(me.images[index]);
            } else {
                img.setSrc(me.images[index]);
            }

            return me;
        },

        /**
         * 下一张
         * @method nextImage
         * @return { Object } fImagePanel对象
         */
        nextImage: function () {
            var me = this,
                ua = navigator.userAgent.toLowerCase(),
                img = me.image;

            me.currentIndex++;
            if (me.currentIndex > me.images.length - 1) {
                me.currentIndex = 0;
            }
            me.switchTo(me.currentIndex);

            return me;
        },

        /**
         * 上一张
         * @method upImage
         * @return { Object } fImagePanel对象
         */
        upImage: function () {
            var me = this,
                img = me.image;

            me.currentIndex--;
            if (me.currentIndex < 0) {
                me.currentIndex = me.images.length - 1;
            }

            me.switchTo(me.currentIndex);
        }
    }
})();