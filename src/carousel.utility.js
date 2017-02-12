(function(exports){

	var ANIMATION_TIME = null;
	var FRAMES = null;

	var WINDOW_WIDTH = window.innerWidth;
	var WINDTH_HEIGHT = window.innerHeight;

	var DIRECTIONS = {
		left: left,
		right: right,
		up: up,
		down: down
	};

	/**
	 *
	 * @param {string} selector - selector for dom elements(only container required)
	 * @param {array} [options.animations] - array of animations between containers. contains: 'direction' & 'speed'
	 * @param {number} [options.numberOfContainers] - number of containers. will init default animations for containers
	 * @param {number} [options.time] - time for animation
	 */
	exports.CarouselInit = function(seletor, options){
		var mainContainer = new Element(seletor);
		new Carousel(mainContainer, options);
	};

	var Carousel = function(element, options){
		var containers = element.find('.carousel-container');
		if(isMobile()){
			console.error('Not support mobile phones in current version');
			containers.show();
			containers.removeClass('carousel-container');

			return;
		}
		removeScroll();
		containers.hide().get(0).show();
		var CURRENT = 0;	
        var length = containers.size();
		options = options || {};

		var directions = options.directions || [];
		if (directions.length < length - 1) {
		    for (var i = directions.length; i < length - 1; ++i) {
		        directions.push('down');
            }
        }

		var easing = (options.easing && typeof options.easing === 'function' ? options.easing : defaultEasing);
		
		var userDeclaredTime = parseInt(options.time);
		ANIMATION_TIME = (userDeclaredTime > 0 ? userDeclaredTime : 400);
		FRAMES = ANIMATION_TIME / 100;

		window.onresize = function(){
			WINDOW_WIDTH = window.innerWidth;
			WINDTH_HEIGHT = window.innerHeight;
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
		var animationInProcess = false;
		window.onkeydown = function(e){
			if(!animationInProcess){
				var code = e.keyCode;
				if(code == 40){
					play(true);
				} else if(code == 38){
					play(false);
				}
			}
		};

		function MouseWheelHandler(){
			var previousPosition = 0;	

			return function(e){
				if(!animationInProcess){
					var delta = e.deltaY || e.detail || e.wheelDelta;
					if(delta + previousPosition > previousPosition){
						play(true);
						previousPosition += delta;
					} else {
						play(false);
						previousPosition += delta;
					}
				}
			}
		}

		function play(next){
			// if next is 'true' show next container
			// otherwise show previous
			var newIndex = null;
			if(next){
				newIndex = (CURRENT+1 < containers.size() ? CURRENT+1 : null);
			} else {
				newIndex = (CURRENT > 0 ? CURRENT-1 : null);
			}

			if(newIndex != null){
				var direction;
				if(newIndex < CURRENT){
					var opposite = oppositeDirection(directions[newIndex]);
					direction = (DIRECTIONS[opposite] ? opposite : 'down');
				} else {
					direction = (DIRECTIONS[directions[CURRENT]] ? directions[CURRENT] : 'up');
				}

				animationInProcess = true;
				var oldElem = containers.get(CURRENT);
				var newElem = containers.get(newIndex);
				CURRENT = newIndex;
				DIRECTIONS[direction](easing, oldElem, newElem, WINDOW_WIDTH, WINDTH_HEIGHT, ANIMATION_TIME, function(){
					animationInProcess = false;
					oldElem.hide();
				});
			} else {
				animationInProcess = false;
			}
		}
	};

	function right(easing, oldElem, newElem, width, height, time, callback){
			newElem.default().css('left', (-width) + 'px');
			oldElem.default();
			
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = easing(diff);

				var oldElemPosition = result*width;
				var newElemPosition = oldElemPosition - width;
				
				newElem.css('left', newElemPosition + 'px');
				oldElem.css('left', oldElemPosition + 'px');
				
				if(result > 0.99){
					newElem.css('left', '0px');
					oldElem.css('left', width + 'px');
					clearInterval(timer);
					callback();
				}
			}, FRAMES);
		}

		function left(easing, oldElem, newElem, width, height, time, callback){
			newElem.default().css('left', (width) + 'px');
			oldElem.default();
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = easing(diff);
				
				var oldElemPosition = -width*result;
				var newElemPosition = oldElemPosition + width;
				newElem.css('left', newElemPosition + 'px');
				oldElem.css('left', oldElemPosition + 'px');
				
				if(result > 0.99){
					oldElem.css('left', (-width)+'px');
					newElem.css('left', '0px');
					clearInterval(timer);
					callback();
				}
			}, FRAMES);
		}

		function down(easing, oldElem, newElem, width, height, time, callback){
			newElem.default().css('top', height+'px'); 
			oldElem.default();
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = easing(diff);
				
				var oldElemPosition = -height*result;
				var newElemPosition = oldElemPosition + height;
				newElem.css('top', newElemPosition + 'px');
				oldElem.css('top', oldElemPosition + 'px');
				
				if(result > 0.99){
					oldElem.css('top', (-height)+'px');
					newElem.css('top', '0px');
					clearInterval(timer);
					callback();
				}
			}, FRAMES);
		}

		function up(easing, oldElem, newElem, width, height, time, callback){
			newElem.default().css('top', (-height)+'px'); 
			oldElem.default();
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = easing(diff);
				
				var oldElemPosition = height*result;
				var newElemPosition = oldElemPosition - height;
				newElem.css('top', newElemPosition + 'px');
				oldElem.css('top', oldElemPosition + 'px');
				
				if(result > 0.99){
					oldElem.css('top', (-height)+'px');
					newElem.css('top', '0px');
					clearInterval(timer);
					callback();
				}
			}, FRAMES);
		}

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
				if(value){
					elements.forEach(function(elem){
						elem.style[prop] = value;
					});
					return this;
				} else {
					return elements[0] ? elements[0].style[prop] : null;
				}
			},
			find: function(selector){
				var children = [];
				this.each(function(element){
					var currentElementChildren = element.querySelectorAll(selector);
					currentElementChildren.forEach(function(e){
                        children.push(e);
					});
				});
				return new Element(children);
			},
			/**
			 *
			 * @param {function} callback - function for each element in DOM elements of object
			 */
			each: function(callback){
				callback = callback || function(){};
				elements.forEach(callback);
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
		var currentAgent = navigator.userAgent.toLowerCase();
		for (var i = 0; i < mobile.length; ++i) {
			if (currentAgent.indexOf(mobile[i].toLowerCase()) > 0) {
				return true;
			}
		}

		return false;
	}

})(window);