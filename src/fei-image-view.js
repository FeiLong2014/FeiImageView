(function () {
    var Fei = window.Fei = {},
	    fixAttr = {
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
	    })();

    var Util = {
        /**
		 * 设置el的属性
		 */
        setAttr: function (el, name, val) {
            el.setAttribute(supportSetAttr ? name : (fixAttr[name] || name), val);
            if (name === 'style') {
                el.style.cssText = val;
            }
        },
        /**
		 * 获取el的属性
		 */
        getAttr: function (el, name) {
            return el.getAttribute(supportSetAttr ? name : (fixAttr[name] || name));
        },
        /**
		 * 创建页面元素 el
		 */
        createElement: function (nodeName, attrs) {
            var el = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', nodeName) : document.createElement(nodeName);
            if (attrs) {
                for (var attr in attrs) {
                    Util.setAttr(el, attr, attrs[attr]);
                }
            }
            return el;
        },
        /**
		 * 组建 附带浏览器前缀的style样式
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
		 * 给el添加事件
		 */
        addEvent: function (el, eventName, fn, scope) {
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
		 * guid
		 */
        getGuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
				function (c) {
				    var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
				    return v.toString(16);
				});
        }
    }

    /**
	 * 定义图片对象
	 */
    Fei.Image = function (config) {
        var me = this;

        me.isLoaded = false;
        me.src = '';
        me.orgWidth = 0;
        me.orgHeight = 0;
        me.width = 0;
        me.height = 0;
        me.rotation = 0;
        me.translateSpeed = 300;
        me.domId = 'fei_imgview_' + Util.getGuid();
        me.dom = Util.createElement('img', {
            id: me.domId
        });
        me.translates = {
            y: 0,
            x: 0
        }
        //event 图片加载完成触发
        me.onload = function () { };

        if (config) {
            for (var item in config) {
                me[item] = config[item];
            }
        }
        me.orgTranslateSpeed = me.translateSpeed;
    }

    /**
	 * 初始化
	 */
    Fei.Image.prototype.init = function () {
        var me = this;

        if (me.dom.complete) {
            me.imgLoad.call(me, me.dom);
        } else {
            me.dom.onload = function () {
                me.imgLoad.call(me, this);
            }
            me.dom.onreadystatechange = function () {
                if (this.readyState == "complete") {
                    me.imgLoad.call(me, this);
                }
            }
        }

        if (me.src) {
            me.setSrc(me.src);
        }

        return me;
    }

    /**
	 * 图片加载完成 初始化参数
	 */
    Fei.Image.prototype.imgLoad = function (img) {
        var me = this;

        if (me.isLoaded) {
            return;
        }
        me.isLoaded = true;
        try {
            var imgObj = new Image();
            imgObj.src = me.src;

            me.orgWidth = imgObj.width;
            me.orgHeight = imgObj.height;

            me.rotation = 0;

            /* 支持预设宽高  图片会拉伸
			if (me.width !== 0 && me.height === 0) {
			me.height = me.orgHeight * (me.width / me.orgWidth);
			}
			if (me.width === 0 && me.height !== 0) {
			me.width = me.orgWidth * (me.height / me.orgHeight);
			}
			if (me.width === 0 && me.height === 0) {
			me.width = imgObj.width;
			me.height = imgObj.height;
			}*/

            delete imgObj
        } catch (e) { }

        if (me.onload) {
            me.onload.call(window, me.dom);
        }
    }

    /**
	 * 设置图片路径
	 */
    Fei.Image.prototype.setSrc = function (src) {
        var me = this;

        me.isLoaded = false;
        me.src = src || me.src;
        me.dom.src = me.src;

        return me;
    }

    /**
	 * 应用图片样式
	 */
    Fei.Image.prototype.doChange = function () {
        var me = this,
		    ua = navigator.userAgent.toLowerCase(),
		    img = document.getElementById(me.domId);

        if (!me.isLoaded) {
            return;
        }

        var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
        var isIE8 = isIE && ua.indexOf("msie") > -1 && parseInt(ua.match(/msie ([\d.]+)/)[1]) === 8.0;
        var isLessThenIE8 = isIE && ua.indexOf("msie") > -1 && parseInt(ua.match(/msie ([\d.]+)/)[1]) < 8.0;
        if (isIE8 || isLessThenIE8) {
            if (!jQuery) {
                throw new Error('IE8以下的浏览器需引入jQuery.js jQueryRotate.js');
                return;
            }
            //IE8
            if (me.isMoveing) {
                jQuery('#' + me.domId).css({
                    left: me.translates.x,
                    top: me.translates.y
                });
            } else {
                jQuery('#' + me.domId).css({
                    cursor: 'move',
                    width: me.width,
                    height: me.height,
                    left: me.translates.x,
                    top: me.translates.y
                });
                jQuery('#' + me.domId + ' > .rvml').css({
                    width: me.width,
                    height: me.height
                });
                jQuery('#' + me.domId).rotate({
                    animateTo: me.rotation,
                    duration: me.translateSpeed
                });
            }
        } else {
            var style = 'cursor:move;width:' + me.width + 'px;height:' + me.height + 'px;';
            style += Util.getBrowserStyle('transform', 'translate(' + me.translates.x + 'px,' + me.translates.y + 'px) rotate(' + me.rotation + 'deg)');
            if (me.translateSpeed > 0) {
                style += Util.getBrowserStyle('transition', 'all ' + me.translateSpeed / 1000 + 's ease');
            }
            Util.setAttr(img, 'style', style);
        }
        return me;
    }
    /**
	 * 放大 缩小
	 * val ：倍数 如1.1
	 */
    Fei.Image.prototype.scale = function (val) {
        var me = this,
		    rotation = me.rotation % 360,
		    imgAdSize = me.getAdSize(),
		    marginAdjustment = 0;

        if (!me.isLoaded) {
            return;
        }
        me.width = me.width * val;
        me.height = me.height * val;
        if (rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270) {
            marginAdjustment = (imgAdSize.h - imgAdSize.w) / 2;
        }
        me.transition(me.translates.x - (me.width - imgAdSize.w) / 2 + marginAdjustment,
			me.translates.y - (me.height - imgAdSize.h) / 2 - marginAdjustment);

        return me;
    }
    /**
	 * 移动
	 * x ：x轴的位移 向右
	 * y ：y轴的位移 向下
	 */
    Fei.Image.prototype.transition = function (x, y) {
        var me = this;
        if (!me.isLoaded) {
            return;
        }
        me.translates.y = y;
        me.translates.x = x;
        return me;
    }
    /**
	 * 旋转
	 * val ：角度
	 */
    Fei.Image.prototype.rotate = function (val) {
        var me = this;
        if (!me.isLoaded) {
            return;
        }
        me.rotation = me.rotation + val;
        return me;
    }
    /**
	 * 获取当前图片真实宽、高。 (旋转、放大后进行换算，即为当前页面所呈现的图像宽、高)
	 */
    Fei.Image.prototype.getAdSize = function () {
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

    /**
	 * 定义图片容器对象
	 */
    Fei.ImagePanel = function (config) {
        var me = this;

        me.width = 600;
        me.height = 600;
        me.currentIndex = 0;

        if (config) {
            for (var item in config) {
                me[item] = config[item];
            }
        }
    }

    /**
	 * 初始化
	 */
    Fei.ImagePanel.prototype.init = function (pDom) {
        var me = this,
		    img;

        me.dom = Util.createElement('div', {
            style: 'position:relative;text-align:left;width:' + me.width + 'px;height:' + me.height + 'px;display:block;overflow:hidden;border:1px solid #58AFD6;'
        });

        me.image = new Fei.Image({
            src: me.images[me.currentIndex],
            onload: function () {
                me.stretchOptimally();
                me.centerImage();
                me.image.doChange();
            }
        });
        me.dom.appendChild(me.image.dom);
        (pDom || document.body).appendChild(me.dom);
        me.image.init();

        me.initEvents();

        return me;
    }

    /**
	 * 初始化事件
	 */
    Fei.ImagePanel.prototype.initEvents = function (pDom) {
        var me = this,
		    img = document.getElementById(me.image.domId);

        Util.addEvent(img, 'mousedown', me.mousedown, me);
        Util.addEvent(img, 'mousemove', me.mousemove, me);
        Util.addEvent(img, 'mouseup', me.mouseup, me);
        Util.addEvent(img, 'mouseout', me.mouseup, me);
    }
    /**
	 * 鼠标按下
	 */
    Fei.ImagePanel.prototype.mousedown = function (ev) {
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
    }
    /**
	 * 鼠标移动
	 */
    Fei.ImagePanel.prototype.mousemove = function (ev) {
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
    }
    /**
	 * 鼠标放开
	 */
    Fei.ImagePanel.prototype.mouseup = function (ev) {
        var me = this;
        me.isMoveing = false;
        me.image.isMoveing = false;
        me.image.translateSpeed = me.image.orgTranslateSpeed;
    }
    /**
	 * 垂直拉伸
	 */
    Fei.ImagePanel.prototype.stretchH = function () {
        var me = this,
		    img = me.image;

        img.width = me.width;
        img.height = img.orgHeight * me.width / img.orgWidth;
    }
    /**
	 * 水平拉伸
	 */
    Fei.ImagePanel.prototype.stretchV = function () {
        var me = this,
		    img = me.image;

        img.height = me.height;
        img.width = img.orgWidth * me.height / img.orgHeight;
    }
    /**
	 * 原始尺寸
	 */
    Fei.ImagePanel.prototype.originalOptimally = function () {
        var me = this,
		    img = me.image;

        img.width = img.orgWidth;
        img.height = img.orgHeight;
    }
    /**
	 * 最佳显示
	 */
    Fei.ImagePanel.prototype.stretchOptimally = function () {
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
    }
    /**
	 * 图片居中
	 */
    Fei.ImagePanel.prototype.centerImage = function () {
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
    }
    /**
	 * 旋转
	 * var 角度
	 */
    Fei.ImagePanel.prototype.rotate = function (val) {
        var me = this,
		    img = me.image;

        img.rotate(val);
    }
    /**
	 * 放大
	 */
    Fei.ImagePanel.prototype.zoomIn = function () {
        var me = this,
		    img = me.image;

        img.scale(1.1);
    }
    /**
	 * 缩小
	 */
    Fei.ImagePanel.prototype.zoomOut = function () {
        var me = this,
		    img = me.image;

        img.scale(0.9);
    }

    /**
	 * 下一张
	 */
    Fei.ImagePanel.prototype.nextImage = function () {
        var me = this,
		    img = me.image;

        me.currentIndex++;
        if (me.currentIndex > me.images.length - 1) {
            me.currentIndex = 0;
        }
        img.setSrc(me.images[me.currentIndex]);
    }
    /**
	 * 上一张
	 */
    Fei.ImagePanel.prototype.upImage = function () {
        var me = this,
		    img = me.image;

        me.currentIndex--;
        if (me.currentIndex < 0) {
            me.currentIndex = me.images.length - 1;
        }

        img.setSrc(me.images[me.currentIndex]);
    }
})();

if (jQuery) {
    (function ($) {
        var supportedCSS, supportedCSSOrigin, styles = document.getElementsByTagName("head")[0].style, toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
        for (var a = 0; a < toCheck.length; a++) if (styles[toCheck[a]] !== undefined) { supportedCSS = toCheck[a]; }
        if (supportedCSS) {
            supportedCSSOrigin = supportedCSS.replace(/[tT]ransform/, "TransformOrigin");
            if (supportedCSSOrigin[0] == "T") supportedCSSOrigin[0] = "t";
        }

        // Bad eval to preven google closure to remove it from code o_O
        eval('IE = "v"=="\v"');

        jQuery.fn.extend({
            rotate: function (parameters) {
                if (this.length === 0 || typeof parameters == "undefined") return;
                if (typeof parameters == "number") parameters = { angle: parameters };
                var returned = [];
                for (var i = 0, i0 = this.length; i < i0; i++) {
                    var element = this.get(i);
                    if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                        var paramClone = $.extend(true, {}, parameters);
                        var newRotObject = new Wilq32.PhotoEffect(element, paramClone)._rootObj;

                        returned.push($(newRotObject));
                    }
                    else {
                        element.Wilq32.PhotoEffect._handleRotation(parameters);
                    }
                }
                return returned;
            },
            getRotateAngle: function () {
                var ret = [];
                for (var i = 0, i0 = this.length; i < i0; i++) {
                    var element = this.get(i);
                    if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                        ret[i] = element.Wilq32.PhotoEffect._angle;
                    }
                }
                return ret;
            },
            stopRotate: function () {
                for (var i = 0, i0 = this.length; i < i0; i++) {
                    var element = this.get(i);
                    if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                        clearTimeout(element.Wilq32.PhotoEffect._timer);
                    }
                }
            }
        });

        // Library agnostic interface

        Wilq32 = window.Wilq32 || {};
        Wilq32.PhotoEffect = (function () {

            if (supportedCSS) {
                return function (img, parameters) {
                    img.Wilq32 = {
                        PhotoEffect: this
                    };

                    this._img = this._rootObj = this._eventObj = img;
                    this._handleRotation(parameters);
                }
            } else {
                return function (img, parameters) {
                    this._img = img;
                    this._onLoadDelegate = [parameters];

                    this._rootObj = document.createElement('span');
                    this._rootObj.style.display = "inline-block";
                    this._rootObj.Wilq32 =
                      {
                          PhotoEffect: this
                      };
                    img.parentNode.insertBefore(this._rootObj, img);

                    if (img.complete) {
                        this._Loader();
                    } else {
                        var self = this;
                        // TODO: Remove jQuery dependency
                        jQuery(this._img).bind("load", function () { self._Loader(); });
                    }
                }
            }
        })();

        Wilq32.PhotoEffect.prototype = {
            _setupParameters: function (parameters) {
                this._parameters = this._parameters || {};
                if (typeof this._angle !== "number") { this._angle = 0; }
                if (typeof parameters.angle === "number") { this._angle = parameters.angle; }
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

                if (parameters.bind && parameters.bind != this._parameters.bind) { this._BindEvents(parameters.bind); }
            },
            _emptyFunction: function () { },
            _defaultEasing: function (x, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b },
            _handleRotation: function (parameters, dontcheck) {
                if (!supportedCSS && !this._img.complete && !dontcheck) {
                    this._onLoadDelegate.push(parameters);
                    return;
                }
                this._setupParameters(parameters);
                if (this._angle == this._parameters.animateTo) {
                    this._rotate(this._angle);
                }
                else {
                    this._animateStart();
                }
            },

            _BindEvents: function (events) {
                if (events && this._eventObj) {
                    // Unbinding previous Events
                    if (this._parameters.bind) {
                        var oldEvents = this._parameters.bind;
                        for (var a in oldEvents) if (oldEvents.hasOwnProperty(a))
                            // TODO: Remove jQuery dependency
                            jQuery(this._eventObj).unbind(a, oldEvents[a]);
                    }

                    this._parameters.bind = events;
                    for (var a in events) if (events.hasOwnProperty(a))
                        // TODO: Remove jQuery dependency
                        jQuery(this._eventObj).bind(a, events[a]);
                }
            },

            _Loader: (function () {
                if (IE)
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
                        this._vimage.style.height = height + "px";
                        this._vimage.style.width = width + "px";
                        this._vimage.style.position = "absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
                        this._vimage.style.top = "0px";
                        this._vimage.style.left = "0px";
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
                else return function () {
                    this._rootObj.setAttribute('id', this._img.getAttribute('id'));
                    this._rootObj.className = this._img.className;

                    this._imgWidth = this._img.naturalWidth;
                    this._imgHeight = this._img.naturalHeight;
                    var _widthMax = Math.sqrt((this._imgHeight) * (this._imgHeight) + (this._imgWidth) * (this._imgWidth));
                    this._width = _widthMax * 3;
                    this._height = _widthMax * 3;

                    this._aspectW = this._img.offsetWidth / this._img.naturalWidth;
                    this._aspectH = this._img.offsetHeight / this._img.naturalHeight;

                    this._img.parentNode.removeChild(this._img);


                    this._canvas = document.createElement('canvas');
                    this._canvas.setAttribute('width', this._width);
                    this._canvas.style.position = "relative";
                    this._canvas.style.left = -this._img.height * this._aspectW + "px";
                    this._canvas.style.top = -this._img.width * this._aspectH + "px";
                    this._canvas.Wilq32 = this._rootObj.Wilq32;

                    this._rootObj.appendChild(this._canvas);
                    this._rootObj.style.width = this._img.width * this._aspectW + "px";
                    this._rootObj.style.height = this._img.height * this._aspectH + "px";
                    this._eventObj = this._canvas;

                    this._cnv = this._canvas.getContext('2d');
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
                }
                else {
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
                if (IE)
                    return function (angle) {
                        this._angle = angle;
                        this._container.style.rotation = (angle % 360) + "deg";
                        this._vimage.style.top = -(this._rotationCenterY - this._imgHeight / 2) + "px";
                        this._vimage.style.left = -(this._rotationCenterX - this._imgWidth / 2) + "px";
                        this._container.style.top = this._rotationCenterY - this._imgHeight / 2 + "px";
                        this._container.style.left = this._rotationCenterX - this._imgWidth / 2 + "px";

                    }
                else if (supportedCSS)
                    return function (angle) {
                        this._angle = angle;
                        this._img.style[supportedCSS] = "rotate(" + (angle % 360) + "deg)";
                        this._img.style[supportedCSSOrigin] = this._parameters.center.join(" ");
                    }
                else
                    return function (angle) {
                        this._angle = angle;
                        angle = (angle % 360) * rad;
                        // clear canvas	
                        this._canvas.width = this._width;//+this._widthAdd;
                        this._canvas.height = this._height;//+this._heightAdd;

                        // REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
                        this._cnv.translate(this._imgWidth * this._aspectW, this._imgHeight * this._aspectH);	// at least center image on screen
                        this._cnv.translate(this._rotationCenterX, this._rotationCenterY);			// we move image back to its orginal 
                        this._cnv.rotate(angle);										// rotate image
                        this._cnv.translate(-this._rotationCenterX, -this._rotationCenterY);		// move image to its center, so we can rotate around its center
                        this._cnv.scale(this._aspectW, this._aspectH); // SCALE - if needed ;)
                        this._cnv.drawImage(this._img, 0, 0);							// First - we draw image
                    }

            })()
        }

        if (IE) {
            Wilq32.PhotoEffect.prototype.createVMLNode = (function () {
                document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
                try {
                    !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                    return function (tagName) {
                        return document.createElement('<rvml:' + tagName + ' class="rvml">');
                    };
                } catch (e) {
                    return function (tagName) {
                        return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                    };
                }
            })();
        }
    })(jQuery);
}
