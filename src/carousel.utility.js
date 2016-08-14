(function(exports){

	var ANIMATION_TIME = 1000;
	var FRAMES = ANIMATION_TIME / 100;

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
	 */
	exports.CarouselInit = function(seletor, options){
		removeScroll();

		var mainContainer = new Element(seletor);
		new Carousel(mainContainer, options);
	}

	var Carousel = function(element, options){
		var containers = element.find('.carousel-container');
		var LENGTH = containers.size();
		var CURRENT = 0;	
		var directions = options.directions;

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

				var oldElem = containers.get(CURRENT);
				var newElem;
				var newIndex;
				var direction;

				if(code == 38){
					newIndex = (CURRENT+1 < containers.size() ? CURRENT+1 : null);
					direction = (DIRECTIONS[directions[CURRENT]] ? directions[CURRENT] : 'down');
				} else if(code == 40){
					newIndex = (CURRENT > 0 ? CURRENT-1 : null);
					var oposite = opositDirection(directions[newIndex])
					direction = (DIRECTIONS[oposite] ? oposite : 'up');
				}

				if(newIndex != null){
					animationInProcess = true;

					newElem = containers.get(newIndex);
					CURRENT = newIndex;
					DIRECTIONS[direction](oldElem, newElem, WINDOW_WIDTH, WINDTH_HEIGHT, ANIMATION_TIME, function(){
						animationInProcess = false;
						oldElem.hide();
					});
				} else {
					animationInProcess = false;
				}
			}
		}

		function MouseWheelHandler(){
			var previousPosition = 0;	

			return function(e){
				if(!animationInProcess){					
					var oldElem = containers.get(CURRENT);
					var newElem;
					var newIndex;
					var direction;

					var delta = e.deltaY || e.detail || e.wheelDelta;
					if(delta + previousPosition > previousPosition){
						newIndex = (CURRENT+1 < containers.size() ? CURRENT+1 : null);

						direction = (DIRECTIONS[directions[CURRENT]] ? directions[CURRENT] : 'down');
					} else {
						newIndex = (CURRENT > 0 ? CURRENT-1 : null);

						var oposite = opositDirection(directions[newIndex])
						direction = (DIRECTIONS[oposite] ? oposite : 'up');
					}

					if(newIndex != null){
						animationInProcess = true;

						newElem = containers.get(newIndex);
						CURRENT = newIndex;
						DIRECTIONS[direction](oldElem, newElem, WINDOW_WIDTH, WINDTH_HEIGHT, ANIMATION_TIME, function(){
							animationInProcess = false;
							oldElem.hide();
						});
						previousPosition += delta;
					} else {
						animationInProcess = false;
					}
				}
			}
		}
	};

	function right(oldElem, newElem, width, height, time, callback){
			newElem.show().css('left', (-width) + 'px').css('top', '0px'); 
			oldElem.show().css('left', '0px').css('top', '0px');
			
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = defaultEasing(diff);

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

		function left(oldElem, newElem, width, height, time, callback){
			newElem.show().css('left', (width) + 'px').css('top', '0px'); 
			oldElem.show().css('left', '0px').css('top', '0px');
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = defaultEasing(diff);
				
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

		function up(oldElem, newElem, width, height, time, callback){
			newElem.show().css('left', '0px').css('top', height+'px'); 
			oldElem.show().css('left', '0px');
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = defaultEasing(diff);
				
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

		function down(oldElem, newElem, width, height, time, callback){
			newElem.show().css('left', '0px').css('top', (-height)+'px'); 
			oldElem.show().css('left', '0px').css('top', '0px');
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = defaultEasing(diff);
				
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
				var childrens = [];
				this.each(function(element, index){
					var currentElementChildrens = element.querySelectorAll(selector);
					currentElementChildrens.forEach(function(e){
						childrens.push(e);
					});
				});
				return new Element(childrens);
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
			}
		}
	}

	function removeScroll(){
		document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    	document.body.scroll = "no"; // ie only
	}

	function opositDirection(direction){
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

})(window);