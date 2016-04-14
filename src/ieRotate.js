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
                if (typeof parameters == "number") parameters = { angle: parameters };
                var newRotObject;
                if (!element.Fei || !element.Fei.PhotoEffect) {
                    var paramClone = utils.clone(parameters);
                    newRotObject = new Fei.PhotoEffect(element, paramClone)._rootObj;
                }
                else {
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