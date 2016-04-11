
(function () {
	var Fei = window.Fei = {},
	fixAttr = {
		tabindex : 'tabIndex',
		readonly : 'readOnly',
		'for' : 'htmlFor',
		'class' : 'className',
		maxlength : 'maxLength',
		cellspacing : 'cellSpacing',
		cellpadding : 'cellPadding',
		rowspan : 'rowSpan',
		colspan : 'colSpan',
		usemap : 'useMap',
		frameborder : 'frameBorder',
		contenteditable : 'contentEditable'
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
		setAttr : function (el, name, val) {
			el.setAttribute(supportSetAttr ? name : (fixAttr[name] || name), val);
			if (name === 'style') {
				el.style.cssText = val;
			}
		},
		/**
		 * 获取el的属性
		 */
		getAttr : function (el, name) {
			return el.getAttribute(supportSetAttr ? name : (fixAttr[name] || name));
		},
		/**
		 * 创建页面元素 el
		 */
		createElement : function (nodeName, attrs) {
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
		getBrowserStyle : function (styleName, styleValue) {
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
		addEvent : function (el, eventName, fn, scope) {
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
		getGuid : function () {
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
				id : me.domId
			});
		me.translates = {
			y : 0,
			x : 0
		}
		//event 图片加载完成触发
		me.onload = function () {};

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
	 * 设置图片路径
	 */
	Fei.Image.prototype.setSrc = function (src) {
		var me = this;

		me.isLoaded = false;
		me.dom.src = src || me.src;

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
		} catch (e) {}

		if (me.onload) {
			me.onload.call(window, me.dom);
		}
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
					left : me.translates.x,
					top : me.translates.y
				});
			} else {
				jQuery('#' + me.domId).css({
					cursor : 'move',
					width : me.width,
					height : me.height,
					left : me.translates.x,
					top : me.translates.y
				});
				jQuery('#' + me.domId + ' > .rvml').css({
					width : me.width,
					height : me.height
				});
				jQuery('#' + me.domId).rotate({
					animateTo : me.rotation,
					duration : me.translateSpeed
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
			w : imgAdWidth,
			h : imgAdHeight
		};
	}

	/**
	 * 定义图片容器对象
	 */
	Fei.ImagePanel = function (config) {
		var me = this;

		me.width = 600;
		me.height = 600;

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
				style : 'position:relative;text-align:left;width:' + me.width + 'px;height:' + me.height + 'px;display:block;overflow:hidden;border:1px solid #58AFD6;'
			});

		me.image = new Fei.Image({
				width : 500,
				src : me.src,
				onload : function () {
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

		if (img.orgHeight < me.height && img.orgWidth < me.width) {
			me.originalOptimally();
		} else {
			if (img.width * me.height / img.height > me.width) {
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
})();
