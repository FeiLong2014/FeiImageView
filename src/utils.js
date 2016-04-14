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