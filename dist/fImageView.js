var Fei = window.Fei = {
    version: '1.0.0'
};
/**
 * 工具函数包
 * @file
 * @module Fei.utils
 * @since 1.0.0
 */

(function () {
    var fixAttr = {
            tabindex: 'tabIndex',
            readonly: 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            maxlength: 'maxLength',
            cellspacing: 'cellSpacing',
            cellpadding: 'cellPadding',
            rowspan: 'rowSpan',
            colspan: 'colSpan',
            usemap: 'useMap',
            frameborder: 'frameBorder',
            contenteditable: 'contentEditable'
        },
        supportSetAttr = (function () {
            div = document.createElement('div');
            div.setAttribute('class', 't');
            return div.className === 't';
        })(),
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = ['valueOf', 'toLocaleString', 'toString', 'constructor'];

    /**
     * 静态工具函数
     * @module Fei.utils
     * @unfile
     */
    var utils = Fei.utils = {
        getScrollTop: function (doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        },
        getScrollLeft: function (doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        },
        /**
         * 获得页面元素的坐标
         * @param { HTMLElement } dom节点
         * @return { Object } 属性名称 {top:10,left:10}
         */
        getCoord: function (el) {
            var _t = 0;
            var _l = 0;
            if (document.documentElement.getBoundingClientRect) {
                var box = el.getBoundingClientRect();
                var oDoc = el.ownerDocument;
                if (navigator.userAgent.indexOf("MSIE 6.0") >= 0) {
                    _t = box.top - 2 + utils.getScrollTop(oDoc);
                    _l = box.left - 2 + utils.getScrollLeft(oDoc);
                } else {
                    _t = box.top + utils.getScrollTop(oDoc);
                    _l = box.left + utils.getScrollLeft(oDoc);
                }
            } else {
                while (el.offsetParent) {
                    _t += el.offsetTop;
                    _l += el.offsetLeft;
                    el = el.offsetParent;
                }
            }
            return {top: _t, left: _l};
        },
        /**
         * 设置给定的dom对象的属性
         * @param { HTMLElement } dom节点
         * @param { String } 属性名称
         * @param { String } 属性值
         */
        setAttr: function (el, name, val) {
            if (!el) {
                return el;
            }
            el.setAttribute(supportSetAttr ? name : (fixAttr[name] || name), val);
            if (name === 'style') {
                el.style.cssText = val;
            }
            return el;
        },

        /**
         * 获取给定的dom对象的属性
         * @param { HTMLElement } dom节点
         * @param { String } 属性名称
         * @return { String } 属性值
         */
        getAttr: function (el, name) {
            return el.getAttribute(supportSetAttr ? name : (fixAttr[name] || name));
        },

        /**
         * 创建dom对象
         * @param { String } dom节点类型 例如 'div'
         * @param { Object } 属性 例如  {id:'11',style:'width:100px'}
         * @return { HTMLElement } 属性值
         */
        createElement: function (nodeName, attrs) {
            var el = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', nodeName) : document.createElement(nodeName);
            if (attrs) {
                for (var attr in attrs) {
                    utils.setAttr(el, attr, attrs[attr]);
                }
            }
            return el;
        },
        /**
         * 移除所有子节点
         * @param { HTMLElement }
         */
        removeChildren: function (pnode) {
            var childs = pnode.childNodes;
            for (var i = childs.length - 1; i >= 0; i--) {
                pnode.removeChild(childs.item(i));
            }
        },
        /**
         * 组建 附带浏览器前缀的style样式
         * @param { String } 样式名称 例如 'transform'
         * @param { String } 样式值 例如  'translate(12px,10px)'
         * @return { String } 样式串 例如
         *   'transform:translate(12px,10px);-o-transform:translate(12px,10px);-ms-transform:translate(12px,10px);-moz-transform:translate(12px,10px);-webkit-transform:translate(12px,10px);'
         */
        getBrowserStyle: function (styleName, styleValue) {
            var temp = ['', '-o-', '-ms-', '-moz-', '-webkit-'],
                styleStr = '';
            for (var i = 0; i < temp.length; i++) {
                styleStr += (temp[i] + styleName + ':' + styleValue + ';');
            }
            return styleStr;
        },
        /**
         * 给dom节点添加事件
         * @param { HTMLElement } dom节点
         * @param { String } 事件名称
         * @param { Function } 事件方法
         * @param { Object } 作用域
         */
        addEvent: function (el, eventName, fn, scope) {
            if (!el) {
                return el;
            }
            var newFn = function () {
                fn.apply(scope || this, arguments);
            }
            if (el.addEventListener) {
                el.addEventListener(eventName, newFn, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + eventName, newFn);
            } else {
                el['on' + eventName] = newFn;
            }
        },
        /**
         * 获取一个相对唯一的guid字符串
         * @return { String } guid
         */
        getGuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        },
        /**
         * 克隆一个对象
         * @param {Object} 要克隆的对象
         * @return { Object } 新对象
         */
        clone: function (item) {
            if (item === null || item === undefined) {
                return item;
            }

            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            var type = toString.call(item),
                i, j, k, clone, key;

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = utils.clone(item[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = utils.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        if (item.hasOwnProperty(k)) {
                            clone[k] = item[k];
                        }
                    }
                }
            }

            return clone || item;
        },
        isUseVml: (function () {
            var ua = navigator.userAgent.toLowerCase(),
                isIE = (!!window.ActiveXObject || "ActiveXObject" in window),
                isIE8 = isIE && ua.indexOf("msie") > -1 && parseInt(ua.match(/msie ([\d.]+)/)[1]) === 8.0,
                isLessThenIE8 = isIE && ua.indexOf("msie") > -1 && parseInt(ua.match(/msie ([\d.]+)/)[1]) < 8.0;

            return function (tagName) {
                return isIE8 || isLessThenIE8;
            };
        })()
    }
})();

/**
 * 针对IE 6 7 8 的图片旋转工具  参考jqueryrotate.js 移除对jquery的依赖
 * @file
 * @module ieRotate
 * @class ieRotate
 * @since 1.0.0
 */

(function () {
    var utils = Fei.utils;

    if (utils.isUseVml()) {
        var ieRotate = Fei.ieRotate = {
            rotate: function (element, parameters) {
                if (!element) {
                    return element;
                }
                if (this.length === 0 || typeof parameters == "undefined") return;
                if (typeof parameters == "number") parameters = {angle: parameters};
                var newRotObject;
                if (!element.Fei || !element.Fei.PhotoEffect) {
                    var paramClone = utils.clone(parameters);
                    newRotObject = new Fei.PhotoEffect(element, paramClone)._rootObj;
                } else {
                    element.Fei.PhotoEffect._handleRotation(parameters);
                    newRotObject = element.Fei.PhotoEffect._rootObj
                }
                return newRotObject;
            }
        }

        Fei.PhotoEffect = function (img, parameters) {
            this._img = img;
            this._onLoadDelegate = [parameters];

            this._rootObj = document.createElement('span');
            this._rootObj.style.display = "inline-block";
            this._rootObj.Fei =
                {
                    PhotoEffect: this
                };
            img.parentNode.insertBefore(this._rootObj, img);
            if (img.complete) {
                this._Loader();
            } else {
                var self = this;
                img.onload = function () {
                    self._Loader.call(self);
                }
                img.onreadystatechange = function () {
                    if (this.readyState == "complete") {
                        self._Loader.call(self);
                    }
                }
            }
        }

        Fei.PhotoEffect.prototype = {
            _setupParameters: function (parameters) {
                this._parameters = this._parameters || {};
                if (typeof this._angle !== "number") {
                    this._angle = 0;
                }
                if (typeof parameters.angle === "number") {
                    this._angle = parameters.angle;
                }
                this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle);

                this._parameters.step = parameters.step || this._parameters.step || null;
                this._parameters.easing = parameters.easing || this._parameters.easing || this._defaultEasing;
                this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
                this._parameters.callback = parameters.callback || this._parameters.callback || this._emptyFunction;
                this._parameters.center = parameters.center || this._parameters.center || ["50%", "50%"];
                if (typeof this._parameters.center[0] == "string") {
                    this._rotationCenterX = (parseInt(this._parameters.center[0], 10) / 100) * this._imgWidth * this._aspectW;
                } else {
                    this._rotationCenterX = this._parameters.center[0];
                }
                if (typeof this._parameters.center[1] == "string") {
                    this._rotationCenterY = (parseInt(this._parameters.center[1], 10) / 100) * this._imgHeight * this._aspectH;
                } else {
                    this._rotationCenterY = this._parameters.center[1];
                }

                if (parameters.bind && parameters.bind != this._parameters.bind) {
                    this._BindEvents(parameters.bind);
                }
            },
            _emptyFunction: function () {
            },
            _defaultEasing: function (x, t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b
            },
            _handleRotation: function (parameters, dontcheck) {
                this._setupParameters(parameters);
                if (this._angle == this._parameters.animateTo) {
                    this._rotate(this._angle);
                } else {
                    this._animateStart();
                }
            },

            _BindEvents: function (events) {
                if (events && this._eventObj) {
                    // Unbinding previous Events
                    if (this._parameters.bind) {
                        var oldEvents = this._parameters.bind;
                        //for (var a in oldEvents) if (oldEvents.hasOwnProperty(a))
                        // TODO: Remove jQuery dependency
                        //jQuery(this._eventObj).unbind(a, oldEvents[a]);
                    }

                    this._parameters.bind = events;
                    //for (var a in events) if (events.hasOwnProperty(a))
                    // TODO: Remove jQuery dependency
                    //jQuery(this._eventObj).bind(a, events[a]);
                }
            },

            _Loader: (function () {
                return function () {
                    var width = this._img.width;
                    var height = this._img.height;
                    var _top = this._img.style.top;
                    var _left = this._img.style.left;
                    var _cursor = this._img.style.cursor;
                    this._imgWidth = width;
                    this._imgHeight = height;
                    this._img.parentNode.removeChild(this._img);

                    this._vimage = this.createVMLNode('image');
                    this._vimage.src = this._img.src;
                    this._vimage.style.height = "100%";
                    this._vimage.style.width = "100%";
                    this._vimage.style.position = "absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
                    this._vimage.style.top = "0px";
                    this._vimage.style.left = "0px";
                    this._vimage.setAttribute('id', this._img.getAttribute('id') + '_img');
                    this._aspectW = this._aspectH = 1;

                    /* Group minifying a small 1px precision problem when rotating object */
                    this._container = this.createVMLNode('group');
                    this._container.style.width = width;
                    this._container.style.height = height;
                    this._container.style.position = "absolute";
                    this._container.style.top = "0px";
                    this._container.style.left = "0px";
                    this._container.setAttribute('coordsize', width - 1 + ',' + (height - 1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
                    this._container.appendChild(this._vimage);

                    this._rootObj.appendChild(this._container);
                    this._rootObj.style.position = "relative"; // FIXES IE PROBLEM
                    this._rootObj.style.width = width + "px";
                    this._rootObj.style.height = height + "px";
                    this._rootObj.style.top = _top;
                    this._rootObj.style.left = _left;
                    this._rootObj.style.cursor = _cursor;
                    this._rootObj.setAttribute('id', this._img.getAttribute('id'));
                    this._rootObj.className = this._img.className;
                    this._eventObj = this._rootObj;
                    var parameters;
                    while (parameters = this._onLoadDelegate.shift()) {
                        this._handleRotation(parameters, true);
                    }
                }
            })(),

            _animateStart: function () {
                if (this._timer) {
                    clearTimeout(this._timer);
                }
                this._animateStartTime = +new Date;
                this._animateStartAngle = this._angle;
                this._animate();
            },
            _animate: function () {
                var actualTime = +new Date;
                var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

                // TODO: Bug for animatedGif for static rotation ? (to test)
                if (checkEnd && !this._parameters.animatedGif) {
                    clearTimeout(this._timer);
                } else {
                    if (this._canvas || this._vimage || this._img) {
                        var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                        this._rotate((~~(angle * 10)) / 10);
                    }
                    if (this._parameters.step) {
                        this._parameters.step(this._angle);
                    }
                    var self = this;
                    this._timer = setTimeout(function () {
                        self._animate.call(self);
                    }, 10);
                }

                // To fix Bug that prevents using recursive function in callback I moved this function to back
                if (this._parameters.callback && checkEnd) {
                    this._angle = this._parameters.animateTo;
                    this._rotate(this._angle);
                    this._parameters.callback.call(this._rootObj);
                }
            },

            _rotate: (function () {
                var rad = Math.PI / 180;
                return function (angle) {
                    this._angle = angle;
                    this._container.style.rotation = (angle % 360) + "deg";
                    this._vimage.style.top = -(this._rotationCenterY - this._imgHeight / 2) + "px";
                    this._vimage.style.left = -(this._rotationCenterX - this._imgWidth / 2) + "px";
                    this._container.style.top = this._rotationCenterY - this._imgHeight / 2 + "px";
                    this._container.style.left = this._rotationCenterX - this._imgWidth / 2 + "px";
                }
            })(),
            createVMLNode: (function () {
                document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
                try {
                    !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                    return function (tagName) {
                        return document.createElement('<rvml:' + tagName + ' class="rvml">');
                    };
                } catch (e) {
                    return function (tagName) {
                        var tempEl = document.createElement(tagName);
                        tempEl.setAttribute('class', 'rvml');
                        tempEl.setAttribute('className', 'rvml');
                        tempEl.setAttribute('xmlns', 'urn:schemas-microsoft.com:vml');
                        return tempEl;
                    };
                }
            })()
        }
    }
})();
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
        me.onload = function () {
        };
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
                var setWH = function () {
                    me.width = imgObj.width;
                    me.height = imgObj.height;
                    me.orgWidth = imgObj.width;
                    me.orgHeight = imgObj.height;
                    me.rotation = 0;

                    if (me.onload) {
                        me.onload.call(window, me);
                    }
                }
                if (imgObj.complete) {
                    setWH();
                } else {
                    imgObj.onload = function () {
                        setWH();
                    };
                    me.dom.onreadystatechange = function () {
                        if (this.readyState == "complete") {
                            setWH();
                        }
                    }
                }

                delete imgObj
            } catch (e) {
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
         * @param { Number } x轴的中心点 如 0.5
         * @param { Number } y轴的中心点 如 0.5
         * @return { Object } fImage对象
         */
        scale: function (val, pointX, poinY) {
            var me = this,
                rotation = me.rotation % 360,
                imgAdSize = me.getAdSize(),
                marginAdjustment = 0,
                pointX = pointX || 0.5,
                poinY = poinY || 0.5;

            if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
                marginAdjustment = (imgAdSize.h - imgAdSize.w) / 2;
            }

            var tX = me.translates.x - (me.width - imgAdSize.w) / 2 + marginAdjustment - (me.width * val - me.width) * pointX;
            var tY = me.translates.y - (me.height - imgAdSize.h) / 2 - marginAdjustment - (me.height * val - me.height) * poinY;

            me.width = me.width * val;
            me.height = me.height * val;

            me.transition(tX, tY);

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
        },

        /**
         * 设置当前图片真实宽、高。 (旋转、放大后进行换算，即为当前页面所呈现的图像宽、高)
         * @method setAdSize
         * @param { Number } 宽 例如: 500
         * @param { Number } 高 例如: 500
         * @return { Object } fImage对象
         */
        setAdSize: function (w, h) {
            var me = this,
                rotation = me.rotation % 360;

            if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
                me.height = w;
                me.width = h;
            } else {
                me.height = h;
                me.width = w;
            }
            return me;
        },

        /**
         * 获取原始图片真实宽、高。 (旋转、放大后进行换算，即为当前页面所呈现的图像宽、高)
         * @method getOrgSize
         * @return { Object } 例如 {w:600, h:400}
         */
        getOrgSize: function () {
            var me = this,
                rotation = me.rotation % 360,
                imgAdWidth = me.orgWidth,
                imgAdHeight = me.orgHeight;

            if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
                imgAdWidth = me.orgHeight;
                imgAdHeight = me.orgWidth;
            }
            return {
                w: imgAdWidth,
                h: imgAdHeight
            };
        }
    }
})();

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
            me.coord = utils.getCoord(me.dom);
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
            if ('onmousewheel' in document.documentElement) {
                utils.addEvent(img, "mousewheel", me.mousewheel, me);
            } else {
                utils.addEvent(img, "DOMMouseScroll", me.mousewheel, me);
            }

            return me;
        },

        /**
         * 鼠标滚轮
         * @event mousewheel
         */
        mousewheel: function (ev) {
            var me = this,
                ev = ev || window.event,
                wheelDelta = ev.wheelDelta,
                scale = 1,
                //容器相对页面的坐标
                coord = me.coord,
                eX = ev.clientX,
                eY = ev.clientY,
                img = me.image;

            if (wheelDelta === undefined) {
                wheelDelta = 0 - (ev.detail || 0);
            }

            if (wheelDelta > 0) {
                scale = 1.1;
            } else {
                scale = 0.9;
            }

            //鼠标相对图片左上角的坐标
            var evCoord = {
                top: eY - coord.top - img.translates.y,
                left: eX - coord.left - img.translates.x
            }

            img.scale(scale, evCoord.left / img.width, evCoord.top / img.height).doChange();

            if (ev.stopPropagation) {
                ev.stopPropagation();
            }
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            window.event ? window.event.returnValue = false : ev.preventDefault();
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
                me.image.transition(x, y).doChange();
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
                img = me.image,
                orgImgSize = img.getOrgSize();

            img.setAdSize(me.width, orgImgSize.h * me.width / orgImgSize.w);
            return me;
        },

        /**
         * 水平拉伸
         * @method stretchV
         * @return { Object } fImagePanel对象
         */
        stretchV: function () {
            var me = this,
                img = me.image,
                orgImgSize = img.getOrgSize();

            img.setAdSize(orgImgSize.w * me.height / orgImgSize.h, me.height);

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
                img = me.image,
                orgImgSize = img.getOrgSize(),
                adImgSize = img.getAdSize();

            if (orgImgSize.h <= me.height && orgImgSize.w <= me.width) {
                me.originalOptimally();
            } else {
                if (adImgSize.w * me.height / adImgSize.h > me.width) {
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
        },

        /**
         * get image
         * @method getImage
         * @return { Object } fImage对象
         */
        getImage: function () {
            var me = this,
                img = me.image;
            return me.image;
        }
    }
})();
