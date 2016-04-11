var Util = {
	fixAttr : (function () {
		return fixAttr = {
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
		};
	})(),
	supportSetAttr : (function () {
		div = document.createElement('div');
		div.setAttribute('class', 't');
		return div.className === 't';
	})(),
	setAttr : function (el, name, val) {
		el.setAttribute(Util.supportSetAttr ? name : (Util.fixAttr[name] || name), val);
		if (name === 'style') {
			el.style.cssText = val;
		}
	},
	getAttr : function (el, name) {
		return el.getAttribute(Util.supportSetAttr ? name : (Util.fixAttr[name] || name));
	},
	createElement : function (nodeName, attrs) {
		var el = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', nodeName) : document.createElement(nodeName);
		if (attrs) {
			for (var attr in attrs) {
				Util.setAttr(el, attr, attrs[attr]);
			}
		}
		return el;
	},
	getTransFormStyle : function (styleName, styleValue) {
		var temp = ['', '-o-', '-ms-', '-moz-', '-webkit-'],
		styleStr = '';
		for (var i = 0; i < temp.length; i++) {
			styleStr += (temp[i] + styleName + ':' + styleValue + ';');
		}
		return styleStr;
	},
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
	getGuid : function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
			function (c) {
			var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}
