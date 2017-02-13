(function(exports){

	const CONTAINERS_SELECTOR = '.carousel-container';
	const FRAMES_PER_ANIMATION = 100;
	const DEFAULT_ANIMATION_TIME = 400;

	var WINDOW_WIDTH = window.innerWidth;
	var WINDOW_HEIGHT = window.innerHeight;

	/**
	 *
	 * @param {String} selector - selector for dom elements(only container required)
     * @param {Object} [options] - optional options for carousel
	 * @param {Number} [options.time] - time for animation
     * @param {Array} [options.direction] - array of directions that declares how to change containers(animation)
     * @param {Function} [options.easing] - function for animation steps
	 */
	exports.CarouselInit = function(selector, options){
		var mainContainer = new Element(selector);
		new Carousel(mainContainer, options);
	};

	var Carousel = function(element, options){
		this._containers = element.find(CONTAINERS_SELECTOR);
		this._options = options || {};

		if(isMobile()){
			this.mobileInit();

			return;
		}

		this.init();
		this.addListeners();
	};

	Carousel.prototype.mobileInit = function() {
		var _c = this._containers;

        console.error('Not support mobile phones in current version');

        _c.show();
        _c.removeClass('carousel-container');
	};

	Carousel.prototype.init = function() {
        removeScroll();

        var _c = this._containers,
			_o = this._options,
			_d = this._options.directions = _o.directions || [];
        this._current = 0;
        this._easing = (_o.easing && typeof _o.easing === 'function' ? _o.easing : defaultEasing);

        var userDeclaredTime = parseInt(_o.time);
        this._animationTime = (userDeclaredTime > 0 ? userDeclaredTime : DEFAULT_ANIMATION_TIME);
        this._frames = this._animationTime / FRAMES_PER_ANIMATION;

        _c.hide().get(0).show();

        var length = _c.size();
        if (_d.length < length - 1) {
            for (var i = _d.length; i < length - 1; ++i) {
                _d.push('down');
            }
        }
	};

	Carousel.prototype.addListeners = function() {
	    var _self = this;
	    _self._animationInProcess = false;

        window.onresize = function(){
            WINDOW_WIDTH = window.innerWidth;
            WINDOW_HEIGHT = window.innerHeight;
        };

        if (window.addEventListener) {
            // IE9, Chrome, Safari, Opera
            window.addEventListener("mousewheel", MouseWheelHandler(), false);
            // Firefox
            window.addEventListener("DOMMouseScroll", MouseWheelHandler(), false);
        } else {
            // IE 6/7/8
            window.attachEvent("onmousewheel", MouseWheelHandler());
        }
        window.onkeydown = function(e){
            if(! _self._animationInProcess){
                var code = e.keyCode;
                if(code == 40){
                    _self._play(true);
                } else if(code == 38){
                    _self._play(false);
                }
            }
        };

        function MouseWheelHandler(){
            var previousPosition = 0;

            var ie = isIE();

            return function(e){
                if(! _self._animationInProcess){
                    var delta = e.deltaY || e.detail || e.wheelDelta;
                    if (ie) {
                        delta = -delta;
                    }
                    if(delta + previousPosition > previousPosition){
                        _self._play(true);
                        previousPosition += delta;
                    } else {
                        _self._play(false);
                        previousPosition += delta;
                    }
                }
            }
        }
    };

	Carousel.prototype._play = function(next) {
	    var _self = this,
            _current = _self._current,
            _containers = _self._containers,
            _directions = _self._options.directions;


        // if next is 'true' show next container
        // otherwise show previous
        var newIndex = null;
        if(next){
            newIndex = (_current+1 < _containers.size() ? _current+1 : null);
        } else {
            newIndex = (_current > 0 ? _current-1 : null);
        }

        if(newIndex != null){
            var direction;
            if(newIndex < _current){
                var opposite = oppositeDirection(_directions[newIndex]);
                direction = (DIRECTIONS[opposite] ? opposite : 'down');
            } else {
                direction = (DIRECTIONS[_directions[_current]] ? _directions[_current] : 'up');
            }

            _self._animationInProcess = true;
            var oldElem = _containers.get(_current);
            var newElem = _containers.get(newIndex);
            _self._current = newIndex;

            this['_' + direction] (oldElem, newElem);
        } else {
            _self._animationInProcess = false;
        }
    };

	Carousel.prototype._right = function(oldElem, newElem){
		newElem.default().css('left', (-WINDOW_WIDTH) + 'px');
		oldElem.default();

		var start = new Date().getTime(),
            _self = this,
            _easing = _self._easing,
            _frames = _self._frames,
            _time = _self._animationTime,
            _timer = setInterval(function(){
                // difference in time from last call in percents
                var diff = (new Date().getTime() - start) / _time;

                // calculate position in persents based on time difference
                var result = _easing(diff);

                var oldElemPosition = result * WINDOW_WIDTH;
                var newElemPosition = oldElemPosition - WINDOW_WIDTH;

                newElem.css('left', newElemPosition + 'px');
                oldElem.css('left', oldElemPosition + 'px');

                if(result > 0.99){
                    newElem.css('left', '0px');
                    oldElem.css('left', WINDOW_WIDTH + 'px');
                    clearInterval(_timer);
                    _self._animationInProcess = false;
                    oldElem.hide();
                }
		}, _frames);
	};

	Carousel.prototype._left = function(oldElem, newElem){
		newElem.default().css('left', (WINDOW_WIDTH) + 'px');
		oldElem.default();

		var start = new Date().getTime(),
            _self = this,
            _easing = _self._easing,
            _frames = _self._frames,
            _time = _self._animationTime,
            _timer = setInterval(function(){
			    // difference in time from last call in percents
                var diff = (new Date().getTime() - start) / _time;

                // calculate position in persents based on time difference
                var result = _easing(diff);

                var oldElemPosition = -WINDOW_WIDTH*result;
                var newElemPosition = oldElemPosition + WINDOW_WIDTH;

                newElem.css('left', newElemPosition + 'px');
                oldElem.css('left', oldElemPosition + 'px');

                if(result > 0.99){
                    oldElem.css('left', (-WINDOW_WIDTH)+'px');
                    newElem.css('left', '0px');
                    clearInterval(_timer);
                    _self._animationInProcess = false;
                    oldElem.hide();
                }
		}, _frames);
	};

	Carousel.prototype._down = function(oldElem, newElem){
		newElem.default().css('top', WINDOW_HEIGHT+'px');
		oldElem.default();

		var start = new Date().getTime(),
            _self = this,
            _easing = _self._easing,
            _frames = _self._frames,
            _time = _self._animationTime,
            _timer = setInterval(function(){
                // difference in time from last call in percents
                var diff = (new Date().getTime() - start) / _time;

                // calculate position in persents based on time difference
                var result = _easing(diff);

                var oldElemPosition = -WINDOW_HEIGHT * result;
                var newElemPosition = oldElemPosition + WINDOW_HEIGHT;

                newElem.css('top', newElemPosition + 'px');
                oldElem.css('top', oldElemPosition + 'px');

                if(result > 0.99){
                    oldElem.css('top', (-WINDOW_HEIGHT)+'px');
                    newElem.css('top', '0px');
                    clearInterval(_timer);
                    _self._animationInProcess = false;
                    oldElem.hide();
                }
		}, _frames);
	};

	Carousel.prototype._up = function(oldElem, newElem){
		newElem.default().css('top', (-WINDOW_HEIGHT)+'px');
		oldElem.default();

		var start = new Date().getTime(),
            _self = this,
            _easing = _self._easing,
            _frames = _self._frames,
            _time = _self._animationTime,
            _timer = setInterval(function(){
                // difference in time from last call in percents
                var diff = (new Date().getTime() - start) / _time;

                // calculate position in persents based on time difference
                var result = _easing(diff);

                var oldElemPosition = WINDOW_HEIGHT * result;
                var newElemPosition = oldElemPosition - WINDOW_HEIGHT;

                newElem.css('top', newElemPosition + 'px');
                oldElem.css('top', oldElemPosition + 'px');

                if(result > 0.99){
                    oldElem.css('top', (-WINDOW_HEIGHT)+'px');
                    newElem.css('top', '0px');
                    clearInterval(_timer);
                    _self._animationInProcess = false;
                    oldElem.hide();
                }
		}, _frames);
	};

	function defaultEasing(value){
		return 1 - Math.cos(value);
	}

	var Element = function(selector){
		var elements;
		if(selector.constructor === String){
			elements = document.querySelectorAll(selector);
		} else if(selector.constructor === Array){
			elements = selector;
		}

		return {
			css: function(prop, value){
			    for (var i = 0; i < elements.length; ++i) {
			        elements[i].style[prop] = value;
                }

				return this;
			},
			find: function(selector){
				var children = [];
				this.each(function(element){
					var currentElementChildren = element.querySelectorAll(selector);
					for (var i = 0; i < currentElementChildren.length; ++i) {
						children.push(currentElementChildren[i]);
					}
				});
				return new Element(children);
			},
			each: function(callback){
				for (var i = 0; i < elements.length; ++i) {
					callback(elements[i], i, elements);
				}
			},
			size: function(){
				return elements.length;
			},
			show: function(){
				this.each(function(element){
					element.style.display = 'block';
				});
				return this;
			},
			hide: function(){
				this.each(function(element){
                    element.style.display = 'none';
				});
				return this;
			},
			get: function(index){
				return new Element([elements[index]]);
			},
			default: function(){
				this.show().css('left', '0px').css('top', '0px');
				return this;
			},
			removeClass: function(className){
				this.each(function(element){
					element.className = element.className.replace(className, '');
				});
			}
		}
	};

	function removeScroll(){
		document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    	document.body.scroll = "no"; // ie only
	}

	function oppositeDirection(direction){
		switch(direction){
			case 'up':
				return 'down';
			case 'down':
				return 'up';
			case 'left':
				return 'right';
			case 'right':
				return 'left';
			default:
				return null;
		}
	}

	function isMobile() {
		if (sessionStorage.desktop) // desktop storage
			return false;
		else if (localStorage.mobile) // mobile storage
			return true;

		var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
		var currentAgent = agent();

		for (var i = 0; i < mobile.length; ++i) {
			if (currentAgent.indexOf(mobile[i].toLowerCase()) > 0) {
				return true;
			}
		}

		return false;
	}

	function isIE() {
	    return agent().indexOf('.net') > -1;
    }

    function agent() {
	    return navigator.userAgent.toLowerCase();
    }

    var DIRECTIONS = {
        left: 'left',
        right: 'right',
        up: 'up',
        down: 'down'
    };

})(window);